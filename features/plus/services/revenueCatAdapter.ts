import Purchases, { LOG_LEVEL } from "react-native-purchases";
import type { PurchasesPackage as RCPackage, CustomerInfo } from "react-native-purchases";
import type {
  SubscriptionService,
  SubscriptionPackage,
  PurchaseResult,
} from "./subscription";

const ENTITLEMENT_KEY = "is_plus";

function deriveIsPlus(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active[ENTITLEMENT_KEY]?.isActive ?? false;
}

function toSubscriptionPackage(pkg: RCPackage): SubscriptionPackage {
  return {
    identifier: pkg.identifier,
    priceString: pkg.product.priceString,
    subscriptionPeriod: pkg.product.subscriptionPeriod,
  };
}

export function createRevenueCatAdapter(apiKey: string, debug?: boolean): SubscriptionService {
  if (debug) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }
  Purchases.configure({ apiKey });
  return new RevenueCatAdapter();
}

class RevenueCatAdapter implements SubscriptionService {
  private packageMap = new Map<string, RCPackage>();

  async checkEntitlement(): Promise<boolean> {
    const info = await Purchases.getCustomerInfo();
    return deriveIsPlus(info);
  }

  async getOfferings(): Promise<SubscriptionPackage[]> {
    const offerings = await Purchases.getOfferings();
    const packages = offerings.current?.availablePackages ?? [];
    this.packageMap.clear();
    for (const pkg of packages) {
      this.packageMap.set(pkg.identifier, pkg);
    }
    return packages.map(toSubscriptionPackage);
  }

  async purchasePackage(pkg: SubscriptionPackage): Promise<PurchaseResult> {
    const original = this.packageMap.get(pkg.identifier);
    if (!original) {
      return {
        success: false,
        error: { type: "unknown", message: "Package not found in store. Refresh and try again." },
      };
    }
    try {
      const { customerInfo } = await Purchases.purchasePackage(original);
      const isPlus = deriveIsPlus(customerInfo);
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
      if (
        err.code === 10 || err.code === "10" ||
        err.code === 35 || err.code === "35" ||
        err.message?.includes("network") || err.message?.includes("offline")
      ) {
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

  async restorePurchases(): Promise<boolean> {
    const info = await Purchases.restorePurchases();
    return deriveIsPlus(info);
  }

  async logout(): Promise<void> {
    await Purchases.logOut();
  }
}
