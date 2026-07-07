import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getDbAdapter } from "@/db/instance";
import { createSqliteGlucoseReadings } from "@/features/glucose/GlucoseReadings";
import type { GlucoseReading, ReadingType } from "@/features/glucose/types";

const readingsRepo = createSqliteGlucoseReadings(getDbAdapter());

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
  }, [filterArg?.date, filterArg?.type, filterArg?.startDate, filterArg?.endDate]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return { readings, loading, error, refresh: load };
}
