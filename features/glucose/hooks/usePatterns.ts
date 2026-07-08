import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useGlucoseReadings } from "@/features/repos/RepoContext";
import { detectPatterns, detectAllPatterns } from "@/features/glucose/services/patterns";
import { thresholdsFromPreferences } from "@/features/glucose/services/readingStatus";
import { usePreferences } from "@/features/onboarding/hooks/usePreferences";
import type { PatternAlert } from "@/features/glucose/services/patterns";
import type { ReadingType } from "@/features/glucose/types";

type UsePatternsResult = {
  alerts: PatternAlert[];
  loading: boolean;
  refresh: () => Promise<void>;
};

export function usePatterns(type?: ReadingType): UsePatternsResult {
  const readingsRepo = useGlucoseReadings();
  const { preferences } = usePreferences();
  const [alerts, setAlerts] = useState<PatternAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const thresholds = preferences ? thresholdsFromPreferences(preferences) : undefined;
      const all = await readingsRepo.query({ limit: 20, orderBy: "date_desc" });
      const data = type ? detectPatterns(all, type, thresholds) : detectAllPatterns(all, thresholds);
      setAlerts(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [readingsRepo, type, preferences]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return { alerts, loading, refresh };
}
