import { getDb } from "@/db/database";
import { getThresholdStatus } from "@/features/glucose/services/thresholds";
import type { ReadingType } from "@/features/glucose/types";

export type PatternAlert = {
  type: ReadingType;
  message: string;
  severity: "warning" | "alert";
  count: number;
};

export async function detectPatterns(
  readingType: ReadingType,
): Promise<PatternAlert[]> {
  const alerts: PatternAlert[] = [];

  try {
    const db = await getDb();
    const recent = await db.getAllAsync<{ value: number }>(
      `SELECT value FROM glucose_readings
       WHERE type = ? ORDER BY date DESC, time DESC LIMIT 4`,
      [readingType],
    );

    if (recent.length < 3) return alerts;

    const highCount = recent.filter((r) => {
      const status = getThresholdStatus(r.value, readingType);
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

    const borderlineCount = recent.filter((r) => {
      const status = getThresholdStatus(r.value, readingType);
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
  } catch (err) {
    console.error("[patterns] detectPatterns failed", err);
  }

  return alerts;
}

export async function detectAllPatterns(): Promise<PatternAlert[]> {
  const types: ReadingType[] = ["fasting", "pre_meal", "post_meal", "bedtime", "other"];
  const results = await Promise.all(types.map((t) => detectPatterns(t)));
  return results.flat();
}
