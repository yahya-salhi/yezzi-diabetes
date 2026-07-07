import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import type { GlucoseReading } from "@/features/glucose/types";
import { getReadings } from "@/features/glucose/services/readings";

type UseReadingsResult = {
  readings: GlucoseReading[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useReadings(date?: string): UseReadingsResult {
  const [readings, setReadings] = useState<GlucoseReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReadings(date);
      setReadings(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [date]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return { readings, loading, error, refresh: load };
}
