import type { GlucoseReading } from "@/features/glucose/types";

export type PdfPreferences = {
  unit: "mg/dL" | "mmol/L";
  fasting_target_low: number;
  fasting_target_high: number;
  postmeal_target_low: number;
  postmeal_target_high: number;
};

export function round(value: number): string {
  return Math.round(value).toString();
}

export function barWidth(value: number, max: number): number {
  return Math.max(4, Math.min(100, (value / max) * 100));
}

export function computeAverages(readings: GlucoseReading[]) {
  const fasting = readings.filter((r) => r.type === "fasting");
  const postMeal = readings.filter((r) => r.type === "post_meal");

  const avg = (arr: GlucoseReading[]): number | null => {
    if (arr.length === 0) return null;
    return arr.reduce((sum, r) => sum + r.value, 0) / arr.length;
  };

  return {
    fastingAvg: avg(fasting),
    postMealAvg: avg(postMeal),
    overallAvg: avg(readings),
    fastingCount: fasting.length,
    postMealCount: postMeal.length,
    totalCount: readings.length,
  };
}

export function buildTrendRows(
  readings: GlucoseReading[],
): { date: string; fasting: number | null; postMeal: number | null }[] {
  const byDate = new Map<string, { fasting: number | null; postMeal: number | null }>();

  for (const r of readings) {
    const existing = byDate.get(r.date) ?? { fasting: null, postMeal: null };
    if (r.type === "fasting" && existing.fasting === null) {
      existing.fasting = r.value;
    }
    if (r.type === "post_meal" && existing.postMeal === null) {
      existing.postMeal = r.value;
    }
    byDate.set(r.date, existing);
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, vals]) => ({ date, ...vals }));
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
