import { useState, useCallback, useEffect } from "react";
import { useImpactEstimator } from "@/features/repos/RepoContext";
import type { MealSpike } from "../types";

type UseInsightsResult = {
  topSpikes: MealSpike[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useInsights(): UseInsightsResult {
  const estimator = useImpactEstimator();
  const [topSpikes, setTopSpikes] = useState<MealSpike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const spikes = await estimator.getTopSpikes(7);
      setTopSpikes(spikes);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load insights";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [estimator]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { topSpikes, loading, error, refresh };
}
