import { useState, useEffect, useCallback, useRef } from "react";
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
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = await syncQuota();
      if (mountedRef.current) setQuota(q);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to sync quota";
      if (mountedRef.current) setError(msg);
    } finally {
      if (mountedRef.current) setLoading(false);
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
