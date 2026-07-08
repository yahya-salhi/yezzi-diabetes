import { useState, useCallback, useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useGlucoseReadings } from "@/features/repos/RepoContext";
import { detectAllPatterns } from "@/features/glucose/services/patterns";
import { thresholdsFromPreferences } from "@/features/glucose/services/readingStatus";
import type { GlucoseReading } from "@/features/glucose/types";
import type { PatternAlert } from "@/features/glucose/services/patterns";
import type { UserPreferences } from "@/features/onboarding/services/preferences";

export type DashboardData = {
  readings: GlucoseReading[];
  dailyAverage: number | null;
  alerts: PatternAlert[];
  loading: boolean;
  refresh: () => Promise<void>;
};

export function useDashboardData(
  today: string,
  preferences?: UserPreferences | null,
): DashboardData {
  const readingsRepo = useGlucoseReadings();
  const [allReadings, setAllReadings] = useState<GlucoseReading[]>([]);
  const [loading, setLoading] = useState(true);

  const thresholds = useMemo(
    () => (preferences ? thresholdsFromPreferences(preferences) : undefined),
    [preferences],
  );

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await readingsRepo.query({ limit: 20, orderBy: "date_desc" });
      setAllReadings(data);
    } catch {
      setAllReadings([]);
    } finally {
      setLoading(false);
    }
  }, [readingsRepo]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const readings = useMemo(
    () => allReadings.filter((r) => r.date === today),
    [allReadings, today],
  );

  const dailyAverage = useMemo(() => {
    if (readings.length === 0) return null;
    return readings.reduce((s, r) => s + r.value, 0) / readings.length;
  }, [readings]);

  const alerts = useMemo(
    () => detectAllPatterns(allReadings, thresholds),
    [allReadings, thresholds],
  );

  return { readings, dailyAverage, alerts, loading, refresh: load };
}
