import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { createSqliteGlucoseReadings } from "@/features/glucose/GlucoseReadings";
import { detectAllPatterns } from "@/features/glucose/services/patterns";
import type { PatternAlert } from "@/features/glucose/services/patterns";

const readingsRepo = createSqliteGlucoseReadings();

type UsePatternsResult = {
  alerts: PatternAlert[];
  loading: boolean;
  refresh: () => Promise<void>;
};

export function usePatterns(): UsePatternsResult {
  const [alerts, setAlerts] = useState<PatternAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const all = await readingsRepo.query({ limit: 20, orderBy: "date_desc" });
      const data = detectAllPatterns(all);
      setAlerts(data);
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

  return { alerts, loading, refresh };
}
