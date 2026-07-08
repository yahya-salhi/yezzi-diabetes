import OpenAI from "openai";

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

async function attemptAnalysis(
  openai: OpenAI,
  imageUrl: string | null,
  text: string | null,
): Promise<MealAnalysisResult> {
  const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];

  if (text) {
    content.push({
      type: "text",
      text: `Meal description: "${text}"\n\n${SYSTEM_PROMPT}`,
    });
  } else {
    content.push({
      type: "text",
      text: SYSTEM_PROMPT,
    });
  }

  if (imageUrl) {
    content.push({
      type: "image_url",
      image_url: { url: imageUrl },
    });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.3,
    messages: [{ role: "user", content }],
  });

  const raw = response.choices[0]?.message?.content;
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
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  const imageUrl = `data:image/jpeg;base64,${base64Image}`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await attemptAnalysis(openai, imageUrl, null);
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
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await attemptAnalysis(openai, null, description);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }

  throw lastError ?? new Error("Text analysis failed after retries");
}
