import type { ReadingType } from "@/features/glucose/types";

export type ThresholdStatus = "normal" | "borderline" | "high";

export function getThresholdStatus(
  valueMgdl: number,
  type: ReadingType,
): ThresholdStatus {
  const isFasting = type === "fasting" || type === "pre_meal";

  if (isFasting) {
    if (valueMgdl < 100) return "normal";
    if (valueMgdl < 126) return "borderline";
    return "high";
  }

  if (valueMgdl < 140) return "normal";
  return "high";
}

export function getThresholdColor(status: ThresholdStatus): string {
  switch (status) {
    case "normal":
      return "#10B981";
    case "borderline":
      return "#FF8904";
    case "high":
      return "#EF4444";
  }
}

export function getThresholdMessage(
  valueMgdl: number,
  type: ReadingType,
): string {
  const status = getThresholdStatus(valueMgdl, type);

  switch (status) {
    case "normal":
      return "Your reading is within the normal range. Keep it up!";
    case "borderline":
      if (type === "fasting")
        return "Your fasting reading is above normal. Consider reviewing your evening routine.";
      return "Your reading is slightly elevated. Monitor your next meal.";
    case "high":
      if (type === "fasting")
        return "Your fasting reading is high. Consider consulting your healthcare provider.";
      return "Your post-meal reading is high. Consider reducing carb portions.";
  }
}

export const IDF_THRESHOLDS = {
  fasting: { normal: { min: 0, max: 99 }, borderline: { min: 100, max: 125 }, high: { min: 126, max: Infinity } },
  pre_meal: { normal: { min: 0, max: 99 }, borderline: { min: 100, max: 125 }, high: { min: 126, max: Infinity } },
  post_meal: { normal: { min: 0, max: 139 }, high: { min: 140, max: Infinity } },
  bedtime: { normal: { min: 0, max: 139 }, high: { min: 140, max: Infinity } },
  other: { normal: { min: 0, max: 139 }, high: { min: 140, max: Infinity } },
} as const;
