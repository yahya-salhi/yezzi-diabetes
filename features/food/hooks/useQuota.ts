import { useState, useEffect, useCallback, useRef } from "react";
import { fetchQuota, getCachedQuota, QuotaStore } from "../services/aiProxy";
import type { QuotaInfo } from "../services/aiProxy";

type UseQuotaResult = {
  quota: QuotaInfo | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useQuota(): UseQuotaResult {
  const [quota, setQuota] = useState<QuotaInfo | null>(QuotaStore.get());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = QuotaStore.subscribe((q) => {
      if (mountedRef.current) setQuota(q);
    });
    return unsubscribe;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = await fetchQuota();
      QuotaStore.set(q);
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
      if (!cancelled && cached && !QuotaStore.get()) {
        QuotaStore.set(cached);
      }
      refresh();
    })();

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  return { quota, loading, error, refresh };
}
