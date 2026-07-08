import type { ReadingType } from "@/features/glucose/types";
import type { UserPreferences } from "@/features/onboarding/services/preferences";
import { colors } from "@/theme/tokens";

export type Status = "normal" | "borderline" | "high";

export type ThresholdBounds = {
  normalUpper: number;
  borderlineUpper: number;
};

export type ThresholdMap = {
  fasting: ThresholdBounds;
  pre_meal: ThresholdBounds;
  post_meal: ThresholdBounds;
  bedtime: ThresholdBounds;
  other: ThresholdBounds;
};

export const IDF_THRESHOLDS: ThresholdMap = {
  fasting: { normalUpper: 99, borderlineUpper: 125 },
  pre_meal: { normalUpper: 99, borderlineUpper: 125 },
  post_meal: { normalUpper: 139, borderlineUpper: 139 },
  bedtime: { normalUpper: 139, borderlineUpper: 139 },
  other: { normalUpper: 139, borderlineUpper: 139 },
};

const BORDERLINE_BUFFER = 25;

export function thresholdsFromPreferences(prefs: UserPreferences): ThresholdMap {
  return {
    fasting: {
      normalUpper: prefs.fasting_target_high,
      borderlineUpper: prefs.fasting_target_high + BORDERLINE_BUFFER,
    },
    pre_meal: {
      normalUpper: prefs.fasting_target_high,
      borderlineUpper: prefs.fasting_target_high + BORDERLINE_BUFFER,
    },
    post_meal: {
      normalUpper: prefs.postmeal_target_high,
      borderlineUpper: prefs.postmeal_target_high,
    },
    bedtime: {
      normalUpper: prefs.postmeal_target_high,
      borderlineUpper: prefs.postmeal_target_high,
    },
    other: {
      normalUpper: prefs.postmeal_target_high,
      borderlineUpper: prefs.postmeal_target_high,
    },
  };
}

export function classifyReading(
  valueMgdl: number,
  type: ReadingType,
  thresholds?: ThresholdMap,
): Status {
  const t = thresholds?.[type] ?? IDF_THRESHOLDS[type];

  if (valueMgdl <= t.normalUpper) return "normal";
  if (valueMgdl <= t.borderlineUpper) return "borderline";
  return "high";
}

export function getLabel(status: Status): string {
  switch (status) {
    case "normal":
      return "In range";
    case "borderline":
      return "Above target";
    case "high":
      return "Above target";
  }
}

export function getColor(status: Status): string {
  switch (status) {
    case "normal":
      return colors.success;
    case "borderline":
      return colors.warning;
    case "high":
      return colors.error;
  }
}

export function getMessage(
  valueMgdl: number,
  type: ReadingType,
  status: Status,
): string {
  switch (status) {
    case "normal":
      return "Your reading is within the normal range. Keep it up!";
    case "borderline":
      if (type === "fasting" || type === "pre_meal")
        return "Your reading is above your target. Consider reviewing your evening routine.";
      return "Your reading is slightly elevated. Monitor your next meal.";
    case "high":
      if (type === "fasting" || type === "pre_meal")
        return "Your reading is high. Consider consulting your healthcare provider.";
      return "Your post-meal reading is high. Consider reducing carb portions.";
  }
}
