import { useState, useCallback, useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useGlucoseReadings } from "@/features/repos/RepoContext";
import { getLoggingStreak, getMilestones } from "@/features/glucose/services/streaks";
import type { Milestone } from "@/features/glucose/services/streaks";

export type LoggingStreakData = {
  streak: number;
  milestones: Milestone[];
  loading: boolean;
};

export function useLoggingStreak(): LoggingStreakData {
  const readingsRepo = useGlucoseReadings();
  const [readings, setReadings] = useState<LoggingStreakData>({
    streak: 0,
    milestones: getMilestones(0),
    loading: true,
  });

  const load = useCallback(async () => {
    try {
      const data = await readingsRepo.query({ limit: 200, orderBy: "date_desc" });
      const streak = getLoggingStreak(data);
      setReadings({
        streak,
        milestones: getMilestones(streak),
        loading: false,
      });
    } catch {
      setReadings({
        streak: 0,
        milestones: getMilestones(0),
        loading: false,
      });
    }
  }, [readingsRepo]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return readings;
}
