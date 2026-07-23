import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { colors, spacing } from "@/theme/tokens";
import { getOfferings, purchasePackage, restorePurchases } from "../services/entitlement";
import type { SubscriptionPackage, PurchaseError } from "../services/entitlement";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function PaywallScreen({ visible, onClose }: Props) {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingOfferings, setLoadingOfferings] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<PurchaseError | null>(null);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setError(null);
    setRestored(false);
    setLoadingOfferings(true);

    getOfferings().then((pkgs) => {
      setPackages(pkgs);
      if (pkgs.length > 0) {
        const yearly = pkgs.find((p) => p.identifier.includes("yearly") || p.identifier.includes("annual"));
        setSelectedId(yearly?.identifier ?? pkgs[0].identifier);
      }
      setLoadingOfferings(false);
    });
  }, [visible]);

  const selected = packages.find((p) => p.identifier === selectedId) ?? null;

  const monthly = packages.find(
    (p) => p.identifier.includes("monthly") && !p.identifier.includes("yearly") && !p.identifier.includes("annual")
  );
  const yearly = packages.find((p) => p.identifier.includes("yearly") || p.identifier.includes("annual"));

  const handlePurchase = async () => {
    if (!selected || purchasing) return;
    setPurchasing(true);
    setError(null);

    const result = await purchasePackage(selected);

    if (result.success) {
      onClose();
    } else if (result.error.type !== "cancelled") {
      setError(result.error);
    }

    setPurchasing(false);
  };

  const handleRestore = async () => {
    if (restoring) return;
    setRestoring(true);
    setError(null);
    setRestored(false);

    const isPlus = await restorePurchases();

    if (isPlus) {
      onClose();
    } else {
      setRestored(true);
    }

    setRestoring(false);
  };

  const formatPrice = (pkg: SubscriptionPackage): string => {
    if (pkg.subscriptionPeriod === "P1M") return `${pkg.priceString}/mo`;
    if (pkg.subscriptionPeriod === "P1Y") return `${pkg.priceString}/yr`;
    return pkg.priceString;
  };

  const getPeriodLabel = (pkg: SubscriptionPackage): string => {
    if (pkg.subscriptionPeriod === "P1M") return "per month";
    if (pkg.subscriptionPeriod === "P1Y") return "per year";
    return "";
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>Unlock YeZZi Plus</Text>
          <Text style={styles.subtitle}>
            Unlimited AI meal scans and PDF doctor reports for your care team.
          </Text>

          <View style={styles.benefits}>
            <BenefitRow text="Unlimited AI meal scans" />
            <BenefitRow text="PDF doctor reports" />
            <BenefitRow text="Future premium insights" />
          </View>

          {loadingOfferings ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          ) : (
            <View style={styles.packages}>
              {monthly && (
                <PackageCard
                  label="Monthly"
                  price={formatPrice(monthly)}
                  period={getPeriodLabel(monthly)}
                  selected={selectedId === monthly.identifier}
                  onPress={() => setSelectedId(monthly.identifier)}
                />
              )}
              {yearly && (
                <PackageCard
                  label="Yearly"
                  price={formatPrice(yearly)}
                  period={getPeriodLabel(yearly)}
                  badge="Save 44%"
                  selected={selectedId === yearly.identifier}
                  onPress={() => setSelectedId(yearly.identifier)}
                />
              )}
            </View>
          )}

          {error && (
            <Text style={styles.errorText}>
              {error.type === "payment_failed"
                ? error.message
                : error.type === "network"
                  ? "Network error. Check your connection and try again."
                  : "Something went wrong. Please try again."}
            </Text>
          )}

          {restored && (
            <Text style={styles.restoredText}>
              No active subscription found to restore.
            </Text>
          )}

          <TouchableOpacity
            style={[styles.subscribeButton, (!selected || purchasing) && styles.subscribeButtonDisabled]}
            onPress={handlePurchase}
            disabled={!selected || purchasing}
            activeOpacity={0.8}
          >
            {purchasing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.subscribeText}>
                {selected ? `Subscribe — ${formatPrice(selected)}` : "Select a plan"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={restoring}
            activeOpacity={0.7}
          >
            {restoring ? (
              <ActivityIndicator size="small" color={colors.textMuted} />
            ) : (
              <Text style={styles.restoreText}>Restore purchases</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function BenefitRow({ text }: { text: string }) {
  return (
    <View style={benefitStyles.row}>
      <View style={benefitStyles.dot} />
      <Text style={benefitStyles.text}>{text}</Text>
    </View>
  );
}

const benefitStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  text: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textPrimary,
  },
});

function PackageCard({
  label,
  price,
  period,
  badge,
  selected,
  onPress,
}: {
  label: string;
  price: string;
  period: string;
  badge?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[cardStyles.card, selected && cardStyles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={cardStyles.left}>
        <Text style={[cardStyles.label, selected && cardStyles.labelSelected]}>{label}</Text>
        <Text style={[cardStyles.period, selected && cardStyles.periodSelected]}>{period}</Text>
      </View>
      <View style={cardStyles.right}>
        {badge && (
          <View style={[cardStyles.badge, selected && cardStyles.badgeSelected]}>
            <Text style={[cardStyles.badgeText, selected && cardStyles.badgeTextSelected]}>
              {badge}
            </Text>
          </View>
        )}
        <Text style={[cardStyles.price, selected && cardStyles.priceSelected]}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.xl,
  },
  cardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentLight,
  },
  left: {
    gap: 2,
  },
  right: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  label: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  labelSelected: {
    color: colors.accent,
  },
  period: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textMuted,
  },
  periodSelected: {
    color: colors.textSecondary,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  priceSelected: {
    color: colors.accent,
  },
  badge: {
    backgroundColor: colors.accentLight,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  badgeSelected: {
    backgroundColor: colors.accent,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.accent,
  },
  badgeTextSelected: {
    color: "#FFFFFF",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "flex-end",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  closeButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  closeText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textMuted,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    gap: spacing.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: -spacing.lg,
  },
  benefits: {
    gap: spacing.md,
  },
  loadingWrap: {
    paddingVertical: spacing.xxxl,
    alignItems: "center",
  },
  packages: {
    gap: spacing.md,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.error,
    textAlign: "center",
  },
  restoredText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textMuted,
    textAlign: "center",
  },
  subscribeButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  subscribeButtonDisabled: {
    opacity: 0.5,
  },
  subscribeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  restoreButton: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  restoreText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textMuted,
  },
});
