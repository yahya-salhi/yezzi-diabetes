import { getThresholdStatus } from "@/features/glucose/services/thresholds";
import type { GlucoseReading, ReadingType } from "@/features/glucose/types";

export type PatternAlert = {
  type: ReadingType;
  message: string;
  severity: "warning" | "alert";
  count: number;
};

export function detectPatterns(
  readings: GlucoseReading[],
  readingType: ReadingType,
): PatternAlert[] {
  const alerts: PatternAlert[] = [];

  const recent = readings
    .filter((r) => r.type === readingType)
    .sort((a, b) => {
      const dateCmp = b.date.localeCompare(a.date);
      if (dateCmp !== 0) return dateCmp;
      return b.time.localeCompare(a.time);
    })
    .slice(0, 4)
    .map((r) => r.value);

  if (recent.length < 3) return alerts;

  const highCount = recent.filter((v) => {
    const status = getThresholdStatus(v, readingType);
    return status === "high";
  }).length;

  if (highCount >= 3) {
    alerts.push({
      type: readingType,
      message: `3+ high ${readingType.replace("_", " ")} readings detected. Consider reviewing your management plan.`,
      severity: "alert",
      count: highCount,
    });
  }

  const borderlineCount = recent.filter((v) => {
    const status = getThresholdStatus(v, readingType);
    return status === "borderline" || status === "high";
  }).length;

  if (borderlineCount >= 3 && highCount < 3) {
    alerts.push({
      type: readingType,
      message: `${readingType.replace("_", " ")} readings are trending high. Monitor closely.`,
      severity: "warning",
      count: borderlineCount,
    });
  }

  return alerts;
}

export function detectAllPatterns(
  readings: GlucoseReading[],
): PatternAlert[] {
  const types: ReadingType[] = ["fasting", "pre_meal", "post_meal", "bedtime", "other"];
  return types.flatMap((t) => detectPatterns(readings, t));
}
