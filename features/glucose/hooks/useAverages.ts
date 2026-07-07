import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getDbAdapter } from "@/db/instance";
import { createSqliteGlucoseReadings } from "@/features/glucose/GlucoseReadings";
import { format } from "date-fns";

const readingsRepo = createSqliteGlucoseReadings(getDbAdapter());

type UseAveragesResult = {
  dailyAverage: number | null;
  rolling7Day: number | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

export function useAverages(): UseAveragesResult {
  const [dailyAverage, setDailyAverage] = useState<number | null>(null);
  const [rolling7Day, setRolling7Day] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const today = format(new Date(), "yyyy-MM-dd");
      const [daily, rolling] = await Promise.all([
        readingsRepo.getDailyAverage(today),
        readingsRepo.getRollingAverage(7),
      ]);
      setDailyAverage(daily);
      setRolling7Day(rolling);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return { dailyAverage, rolling7Day, loading, refresh };
}
