export interface Env {
  QUOTA: KVNamespace;
  OPENROUTER_API_KEY: string;
}

const FREE_TIER_LIMIT = 10;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const TIMEOUT_MS = 30_000;

function getMonthKey(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function quotaKVKey(deviceUuid: string): string {
  return `quota:${deviceUuid}:${getMonthKey()}`;
}

function getNextMonthReset(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const next = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0));
  return next.toISOString();
}

async function getQuota(
  kv: KVNamespace,
  deviceUuid: string
): Promise<{ used: number; limit: number; remaining: number; resets_at: string }> {
  const key = quotaKVKey(deviceUuid);
  const raw = await kv.get(key);
  const used = raw ? parseInt(raw, 10) : 0;
  return {
    used,
    limit: FREE_TIER_LIMIT,
    remaining: Math.max(0, FREE_TIER_LIMIT - used),
    resets_at: getNextMonthReset(),
  };
}

async function incrementQuota(kv: KVNamespace, deviceUuid: string): Promise<void> {
  const key = quotaKVKey(deviceUuid);
  const raw = await kv.get(key);
  const current = raw ? parseInt(raw, 10) : 0;
  await kv.put(key, String(current + 1));
}

interface NutritionResult {
  food_name: string;
  calories: number;
  carbs_g: number;
  protein_g: number | null;
  fat_g: number | null;
  estimated_impact_mgdl: number;
}

const SYSTEM_PROMPT = `You are a nutrition analysis assistant. Identify the meal in the image and estimate its nutritional values. Return ONLY valid JSON with these exact fields:
{
  "food_name": string,
  "calories": number,
  "carbs_g": number,
  "protein_g": number | null,
  "fat_g": number | null,
  "estimated_impact_mgdl": number
}
If you cannot estimate protein or fat, set them to null. estimated_impact_mgdl is the estimated blood glucose rise in mg/dL for a person with diabetes.`;

function isValidResult(data: unknown): data is NutritionResult {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.food_name === "string" &&
    typeof d.calories === "number" &&
    typeof d.carbs_g === "number" &&
    (typeof d.protein_g === "number" || d.protein_g === null) &&
    (typeof d.fat_g === "number" || d.fat_g === null) &&
    typeof d.estimated_impact_mgdl === "number"
  );
}

function buildPhotoMessages(base64Image: string) {
  const imageUrl = `data:image/jpeg;base64,${base64Image}`;
  return [
    {
      role: "user",
      content: [
        { type: "text", text: SYSTEM_PROMPT },
        { type: "image_url", image_url: { url: imageUrl } },
      ],
    },
  ];
}

function buildTextMessages(description: string) {
  return [
    {
      role: "user",
      content: `Meal description: "${description}"\n\n${SYSTEM_PROMPT}`,
    },
  ];
}

async function callOpenRouter(
  apiKey: string,
  messages: unknown[],
): Promise<NutritionResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://yezziapp.com",
        "X-Title": "YeZZi",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        temperature: 0.3,
        messages,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`OpenRouter ${res.status}: ${errBody}`);
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) throw new Error("Empty response from GPT-4o");

    const cleaned = raw.replace(/```(?:json)?\s*/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (!isValidResult(parsed)) {
      throw new Error("Invalid response shape from GPT-4o");
    }

    return parsed;
  } finally {
    clearTimeout(timer);
  }
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function handleOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

interface AnalyzeBody {
  device_uuid?: string;
  mode?: "photo" | "text";
  image_base64?: string;
  description?: string;
}

async function handleAnalyze(request: Request, env: Env): Promise<Response> {
  const body = await request.json<AnalyzeBody>();
  const deviceUuid = body?.device_uuid;
  const mode = body?.mode;

  if (!deviceUuid) {
    return json({ error: "missing_device_uuid" }, 400);
  }

  if (mode !== "photo" && mode !== "text") {
    return json({ error: "invalid_mode" }, 400);
  }

  if (mode === "photo" && !body.image_base64) {
    return json({ error: "missing_image" }, 400);
  }

  if (mode === "text" && !body.description) {
    return json({ error: "missing_description" }, 400);
  }

  const quota = await getQuota(env.QUOTA, deviceUuid);
  if (quota.remaining <= 0) {
    return json({ error: "quota_exhausted", quota }, 429);
  }

  let messages: unknown[];
  if (mode === "photo") {
    messages = buildPhotoMessages(body.image_base64!);
  } else {
    messages = buildTextMessages(body.description!);
  }

  try {
    const result = await callOpenRouter(env.OPENROUTER_API_KEY, messages);
    await incrementQuota(env.QUOTA, deviceUuid);
    const updatedQuota = await getQuota(env.QUOTA, deviceUuid);
    return json({ result, quota: updatedQuota });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("timed out") || message.includes("abort")) {
      return json({ error: "proxy_unavailable" }, 503);
    }
    return json({ error: "ai_service_error" }, 502);
  }
}

async function handleQuota(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const deviceUuid = url.searchParams.get("device_uuid");

  if (!deviceUuid) {
    return json({ error: "missing_device_uuid" }, 400);
  }

  const quota = await getQuota(env.QUOTA, deviceUuid);
  return json(quota);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return handleOptions();
    }

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/analyze" && request.method === "POST") {
      return handleAnalyze(request, env);
    }

    if (path === "/quota" && request.method === "GET") {
      return handleQuota(request, env);
    }

    return json({ error: "not_found" }, 404);
  },
};
