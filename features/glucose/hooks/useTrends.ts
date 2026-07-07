import { useState, useCallback, useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { format } from "date-fns";
import { getReadingsForRange } from "@/features/glucose/services/trends";
import type { GlucoseReading } from "@/features/glucose/types";

const TREND_DAYS = 14;

type ChartData = { value: number; label: string }[];

type UseTrendsResult = {
  fastingData: ChartData;
  postMealData: ChartData;
  loading: boolean;
};

export function useTrends(): UseTrendsResult {
  const [readings, setReadings] = useState<GlucoseReading[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getReadingsForRange(TREND_DAYS);
      setReadings(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const { fastingData, postMealData } = useMemo(() => {
    const fasting: ChartData = [];
    const postMeal: ChartData = [];
    const seenDates = new Set<string>();

    for (const r of readings) {
      if (seenDates.has(r.date)) continue;
      if (r.type === "fasting") {
        fasting.push({ value: Math.round(r.value), label: format(new Date(r.date), "MMM dd") });
        seenDates.add(r.date);
      }
      if (r.type === "post_meal") {
        postMeal.push({ value: Math.round(r.value), label: format(new Date(r.date), "MMM dd") });
        seenDates.add(r.date);
      }
    }

    return {
      fastingData: fasting.slice(-TREND_DAYS),
      postMealData: postMeal.slice(-TREND_DAYS),
    };
  }, [readings]);

  return { fastingData, postMealData, loading };
}
