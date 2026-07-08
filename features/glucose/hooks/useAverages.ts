import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useGlucoseReadings } from "@/features/repos/RepoContext";
import { format } from "date-fns";

type UseAveragesResult = {
  dailyAverage: number | null;
  rolling7Day: number | null;
  rolling14Day: number | null;
  rolling30Day: number | null;
  rolling90Day: number | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

export function useAverages(): UseAveragesResult {
  const readingsRepo = useGlucoseReadings();
  const [dailyAverage, setDailyAverage] = useState<number | null>(null);
  const [rolling7Day, setRolling7Day] = useState<number | null>(null);
  const [rolling14Day, setRolling14Day] = useState<number | null>(null);
  const [rolling30Day, setRolling30Day] = useState<number | null>(null);
  const [rolling90Day, setRolling90Day] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const today = format(new Date(), "yyyy-MM-dd");
      const [daily, r7, r14, r30, r90] = await Promise.all([
        readingsRepo.getDailyAverage(today),
        readingsRepo.getRollingAverage(7),
        readingsRepo.getRollingAverage(14),
        readingsRepo.getRollingAverage(30),
        readingsRepo.getRollingAverage(90),
      ]);
      setDailyAverage(daily);
      setRolling7Day(r7);
      setRolling14Day(r14);
      setRolling30Day(r30);
      setRolling90Day(r90);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [readingsRepo]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return { dailyAverage, rolling7Day, rolling14Day, rolling30Day, rolling90Day, loading, refresh };
}
