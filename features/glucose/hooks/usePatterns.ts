import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { detectAllPatterns } from "@/features/glucose/services/patterns";
import type { PatternAlert } from "@/features/glucose/services/patterns";

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
      const data = await detectAllPatterns();
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
