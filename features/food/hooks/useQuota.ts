import { useState, useEffect, useCallback } from "react";
import { getCachedQuota, syncQuota } from "../services/quota";
import type { QuotaInfo } from "../services/proxy";

type UseQuotaResult = {
  quota: QuotaInfo | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useQuota(): UseQuotaResult {
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = await syncQuota();
      setQuota(q);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to sync quota";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const cached = await getCachedQuota();
      if (!cancelled && cached) {
        setQuota(cached);
      }
      refresh();
    })();

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  return { quota, loading, error, refresh };
}
