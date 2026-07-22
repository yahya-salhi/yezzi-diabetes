import type { SubscriptionPackage } from "./subscription";
import { getSubscriptionService } from "./subscription";
export type { SubscriptionPackage, PurchaseResult, PurchaseError } from "./subscription";

export interface PlusState {
  isPlus: boolean;
}

type StoreListener = (state: PlusState) => void;

let currentState: PlusState = { isPlus: false };
const listeners = new Set<StoreListener>();

export const PlusStore = {
  get(): PlusState {
    return currentState;
  },

  set(state: PlusState) {
    currentState = state;
    listeners.forEach((fn) => {
      try {
        fn(state);
      } catch {}
    });
  },

  subscribe(fn: StoreListener): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

export async function checkEntitlement(): Promise<boolean> {
  try {
    const isPlus = await getSubscriptionService().checkEntitlement();
    PlusStore.set({ isPlus });
    return isPlus;
  } catch {
    return false;
  }
}

export async function getOfferings(): Promise<SubscriptionPackage[]> {
  try {
    return await getSubscriptionService().getOfferings();
  } catch {
    return [];
  }
}

export async function purchasePackage(pkg: SubscriptionPackage) {
  const result = await getSubscriptionService().purchasePackage(pkg);
  if (result.success) {
    PlusStore.set({ isPlus: result.isPlus });
  }
  return result;
}

export async function restorePurchases(): Promise<boolean> {
  try {
    const isPlus = await getSubscriptionService().restorePurchases();
    PlusStore.set({ isPlus });
    return isPlus;
  } catch {
    return false;
  }
}
