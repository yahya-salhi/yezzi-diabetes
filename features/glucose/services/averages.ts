import type { GlucoseReading } from "@/features/glucose/types";

export function computeAverage(readings: GlucoseReading[]): number | null {
  if (readings.length === 0) return null;
  return readings.reduce((sum, r) => sum + r.value, 0) / readings.length;
}
