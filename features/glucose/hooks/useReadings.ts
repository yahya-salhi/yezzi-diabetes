import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useGlucoseReadings } from "@/features/repos/RepoContext";
import type { GlucoseReading, ReadingType } from "@/features/glucose/types";

type UseReadingsFilter = {
  date?: string;
  type?: ReadingType;
  startDate?: string;
  endDate?: string;
};

type UseReadingsResult = {
  readings: GlucoseReading[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useReadings(filter?: string | UseReadingsFilter): UseReadingsResult {
  const readingsRepo = useGlucoseReadings();
  const [readings, setReadings] = useState<GlucoseReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterArg = typeof filter === "string" ? { date: filter } : filter;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await readingsRepo.query(filterArg);
      setReadings(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [readingsRepo, filterArg?.date, filterArg?.type, filterArg?.startDate, filterArg?.endDate]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return { readings, loading, error, refresh: load };
}
