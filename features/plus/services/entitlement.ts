import Purchases, {
  type PurchasesPackage,
  type CustomerInfo,
} from "react-native-purchases";

const ENTITLEMENT_KEY = "is_plus";

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

function deriveIsPlus(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active[ENTITLEMENT_KEY]?.isActive ?? false;
}

export async function checkEntitlement(): Promise<boolean> {
  try {
    const info = await Purchases.getCustomerInfo();
    const isPlus = deriveIsPlus(info);
    PlusStore.set({ isPlus });
    return isPlus;
  } catch {
    return false;
  }
}

export async function getOfferings(): Promise<PurchasesPackage[]> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages ?? [];
  } catch {
    return [];
  }
}

export type PurchaseResult =
  | { success: true; isPlus: boolean }
  | { success: false; error: PurchaseError };

export type PurchaseError =
  | { type: "cancelled" }
  | { type: "payment_failed"; message: string }
  | { type: "network"; message: string }
  | { type: "unknown"; message: string };

export async function purchasePackage(pkg: PurchasesPackage): Promise<PurchaseResult> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const isPlus = deriveIsPlus(customerInfo);
    PlusStore.set({ isPlus });
    return { success: true, isPlus };
  } catch (err: any) {
    if (err.code === 1 || err.code === "1" || err.message?.includes("cancelled")) {
      return { success: false, error: { type: "cancelled" } };
    }
    if (err.code === 2 || err.code === "2" || err.message?.includes("payment")) {
      return {
        success: false,
        error: { type: "payment_failed", message: err.message ?? "Payment failed" },
      };
    }
    if (err.code === 10 || err.code === "10" || err.code === 35 || err.code === "35" || err.message?.includes("network") || err.message?.includes("offline")) {
      return {
        success: false,
        error: { type: "network", message: err.message ?? "Network error" },
      };
    }
    return {
      success: false,
      error: { type: "unknown", message: err.message ?? "Purchase failed" },
    };
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    const info = await Purchases.restorePurchases();
    const isPlus = deriveIsPlus(info);
    PlusStore.set({ isPlus });
    return isPlus;
  } catch {
    return false;
  }
}
