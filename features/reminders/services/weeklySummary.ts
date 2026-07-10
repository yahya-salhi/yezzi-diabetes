import { classifyReading } from "@/features/glucose/services/readingStatus";
import type { GlucoseReadings } from "@/features/glucose/GlucoseReadings";

export async function getDaysInRange(
  glucoseReadings: GlucoseReadings,
  daysBack: number,
): Promise<{ totalDays: number; inRangeDays: number }> {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - daysBack);

  const startStr = formatDate(startDate);
  const endStr = formatDate(today);

  const readings = await glucoseReadings.query({
    startDate: startStr,
    endDate: endStr,
    orderBy: "date_asc",
  });

  const grouped = new Map<string, typeof readings>();
  for (const r of readings) {
    const existing = grouped.get(r.date) ?? [];
    existing.push(r);
    grouped.set(r.date, existing);
  }

  let inRangeDays = 0;
  for (const [, dayReadings] of grouped) {
    const allInRange = dayReadings.every(
      (r) => classifyReading(r.value, r.type) === "normal",
    );
    if (allInRange) inRangeDays++;
  }

  return {
    totalDays: grouped.size,
    inRangeDays,
  };
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
