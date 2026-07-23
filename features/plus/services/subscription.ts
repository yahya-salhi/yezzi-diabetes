export interface SubscriptionPackage {
  identifier: string;
  priceString: string;
  subscriptionPeriod: string | null;
}

export type PurchaseResult =
  | { success: true; isPlus: boolean }
  | { success: false; error: PurchaseError };

export type PurchaseError =
  | { type: "cancelled" }
  | { type: "payment_failed"; message: string }
  | { type: "network"; message: string }
  | { type: "unknown"; message: string };

export interface SubscriptionService {
  checkEntitlement(): Promise<boolean>;
  getOfferings(): Promise<SubscriptionPackage[]>;
  purchasePackage(pkg: SubscriptionPackage): Promise<PurchaseResult>;
  restorePurchases(): Promise<boolean>;
  logout(): Promise<void>;
}

let currentService: SubscriptionService | null = null;

export function getSubscriptionService(): SubscriptionService {
  if (!currentService) {
    throw new Error("SubscriptionService not initialized. Call setSubscriptionService() in App.tsx before use.");
  }
  return currentService;
}

export function setSubscriptionService(service: SubscriptionService): void {
  currentService = service;
}
