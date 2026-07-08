import { colors } from "@/theme/tokens";
import type { ReadingType } from "@/features/glucose/types";
import type { Status } from "@/features/glucose/services/readingStatus";

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
