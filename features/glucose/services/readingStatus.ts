import type { ReadingType } from "@/features/glucose/types";
import type { UserPreferences } from "@/features/onboarding/services/preferences";

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
