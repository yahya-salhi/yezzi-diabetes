import { useState, useEffect, useCallback, useRef } from "react";
import { checkEntitlement, PlusStore } from "../services/entitlement";

type UsePlusResult = {
  isPlus: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
};

export function usePlus(): UsePlusResult {
  const [isPlus, setIsPlus] = useState(PlusStore.get().isPlus);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = PlusStore.subscribe((state) => {
      if (mountedRef.current) setIsPlus(state.isPlus);
    });
    return unsubscribe;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await checkEntitlement();
    } catch {
      // PlusStore stays at current value
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { isPlus, loading, refresh };
}
