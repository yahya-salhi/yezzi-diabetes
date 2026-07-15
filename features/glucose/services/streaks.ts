import { format, differenceInCalendarDays, parseISO, subDays } from "date-fns";
import type { GlucoseReading } from "@/features/glucose/types";

export type Milestone = {
  days: number;
  label: string;
  reached: boolean;
};

const MILESTONE_THRESHOLDS = [7, 30, 90] as const;

export function getLoggingStreak(readings: GlucoseReading[]): number {
  if (readings.length === 0) return 0;

  const uniqueDates = [...new Set(readings.map((r) => r.date))].sort().reverse();

  const today = format(new Date(), "yyyy-MM-dd");
  const latestDate = uniqueDates[0];

  const daysSinceLatest = differenceInCalendarDays(parseISO(today), parseISO(latestDate));
  if (daysSinceLatest > 0) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const expected = format(subDays(parseISO(today), i), "yyyy-MM-dd");
    if (uniqueDates.includes(expected)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function getMilestones(streak: number): Milestone[] {
  return MILESTONE_THRESHOLDS.map((days) => ({
    days,
    label: `${days}-day streak`,
    reached: streak >= days,
  }));
}
