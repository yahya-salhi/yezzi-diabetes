import { useRef } from "react";
import { useQuota } from "../hooks/useQuota";
import { usePlus } from "@/features/plus/hooks/usePlus";
import type { QuotaInfo } from "./aiProxy";

export type StatusVariant = "muted" | "warning" | "error" | "plus";

export interface ScanAccessInfo {
  canAnalyze: boolean;
  isUnlimited: boolean;
  isQuotaExhausted: boolean;
  remaining: number | null;
  isPlus: boolean;
  quota: QuotaInfo | null;
  statusText: string;
  statusVariant: StatusVariant;
}

export function computeScanAccess(isPlus: boolean, quota: QuotaInfo | null): ScanAccessInfo {
  const isUnlimited = isPlus || quota?.remaining === -1;
  const remaining = isUnlimited ? null : (quota?.remaining ?? null);
  const isQuotaExhausted = !isPlus && remaining !== null && remaining <= 0;
  const canAnalyze = isUnlimited || (remaining !== null && remaining > 0);

  let statusText: string;
  let statusVariant: StatusVariant;

  if (isUnlimited) {
    statusText = "Unlimited AI scans";
    statusVariant = "plus";
  } else if (remaining === null) {
    statusText = "";
    statusVariant = "muted";
  } else if (remaining <= 0) {
    statusText = "No AI scans left — enter meals manually";
    statusVariant = "error";
  } else {
    statusText = `${remaining} AI scan${remaining === 1 ? "" : "s"} left this month`;
    statusVariant = remaining <= 3 ? "warning" : "muted";
  }

  return {
    canAnalyze,
    isUnlimited,
    isQuotaExhausted,
    remaining,
    isPlus,
    quota,
    statusText,
    statusVariant,
  };
}

export function useScanAccess(): ScanAccessInfo {
  const { quota } = useQuota();
  const { isPlus } = usePlus();
  return computeScanAccess(isPlus, quota);
}

export function useIsPlusRef(): { current: boolean } {
  const { isPlus } = useScanAccess();
  const ref = useRef(isPlus);
  ref.current = isPlus;
  return ref;
}
