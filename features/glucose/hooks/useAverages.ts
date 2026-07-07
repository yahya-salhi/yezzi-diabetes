import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getDailyAverage, getRollingAverage } from "@/features/glucose/services/averages";
import { format } from "date-fns";

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
        getDailyAverage(today),
        getRollingAverage(7),
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
