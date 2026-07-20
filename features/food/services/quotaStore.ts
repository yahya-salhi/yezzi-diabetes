import type { QuotaInfo } from "./proxy";

type Listener = (quota: QuotaInfo) => void;

let currentQuota: QuotaInfo | null = null;
const listeners = new Set<Listener>();

export const QuotaStore = {
  get(): QuotaInfo | null {
    return currentQuota;
  },

  set(quota: QuotaInfo) {
    currentQuota = quota;
    listeners.forEach((fn) => {
      try {
        fn(quota);
      } catch {}
    });
  },

  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
