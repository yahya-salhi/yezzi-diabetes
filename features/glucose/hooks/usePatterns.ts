import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getDbAdapter } from "@/db/instance";
import { createSqliteGlucoseReadings } from "@/features/glucose/GlucoseReadings";
import { detectPatterns, detectAllPatterns } from "@/features/glucose/services/patterns";
import type { PatternAlert } from "@/features/glucose/services/patterns";
import type { ReadingType } from "@/features/glucose/types";

const readingsRepo = createSqliteGlucoseReadings(getDbAdapter());

type UsePatternsResult = {
  alerts: PatternAlert[];
  loading: boolean;
  refresh: () => Promise<void>;
};

export function usePatterns(type?: ReadingType): UsePatternsResult {
  const [alerts, setAlerts] = useState<PatternAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const all = await readingsRepo.query({ limit: 20, orderBy: "date_desc" });
      const data = type ? detectPatterns(all, type) : detectAllPatterns(all);
      setAlerts(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [type]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return { alerts, loading, refresh };
}
