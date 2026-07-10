const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const TIMEOUT_MS = 30_000;

export type MealAnalysisResult = {
  food_name: string;
  calories: number;
  carbs_g: number;
  protein_g: number | null;
  fat_g: number | null;
  estimated_impact_mgdl: number;
};

const MAX_RETRIES = 2;

function isValidResult(data: unknown): data is MealAnalysisResult {
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

function fetchWithTimeout(
  url: string,
  options: Record<string, unknown>,
  timeoutMs: number,
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Request timed out")), timeoutMs);
    fetch(url, options as RequestInit)
      .then(resolve, reject)
      .finally(() => clearTimeout(timer));
  });
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

async function openRouterRequest(
  apiKey: string,
  body: Record<string, unknown>,
): Promise<MealAnalysisResult> {
  const res = await fetchWithTimeout(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://yezziapp.com",
      "X-Title": "YeZZi",
    },
    body: JSON.stringify(body),
  }, TIMEOUT_MS);

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`OpenRouter ${res.status}: ${errBody}`);
  }

  const json = await res.json();
  const raw = json.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty response from GPT-4o");

  const cleaned = raw.replace(/```(?:json)?\s*/g, "").trim();
  const parsed = JSON.parse(cleaned);

  if (!isValidResult(parsed)) {
    throw new Error("Invalid response shape from GPT-4o");
  }

  return parsed;
}

export async function analyzeMealFromPhoto(
  base64Image: string,
  apiKey: string,
): Promise<MealAnalysisResult> {
  const imageUrl = `data:image/jpeg;base64,${base64Image}`;

  const messages: { role: string; content: unknown[] } = {
    role: "user",
    content: [
      { type: "text", text: SYSTEM_PROMPT },
      { type: "image_url", image_url: { url: imageUrl } },
    ],
  };

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await openRouterRequest(apiKey, {
        model: "openai/gpt-4o",
        temperature: 0.3,
        messages: [messages],
      });
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }

  throw lastError ?? new Error("Photo analysis failed after retries");
}

export async function analyzeMealFromText(
  description: string,
  apiKey: string,
): Promise<MealAnalysisResult> {
  const messages = [
    {
      role: "user",
      content: `Meal description: "${description}"\n\n${SYSTEM_PROMPT}`,
    },
  ];

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await openRouterRequest(apiKey, {
        model: "openai/gpt-4o",
        temperature: 0.3,
        messages,
      });
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }

  throw lastError ?? new Error("Text analysis failed after retries");
}
