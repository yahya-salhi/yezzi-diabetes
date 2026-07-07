import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/tokens";

type Props = {
  impact: number;
};

function getImpactColor(impact: number): string {
  if (impact < 20) return colors.success;
  if (impact < 40) return colors.warning;
  return colors.error;
}

export function EstimatedImpactBadge({ impact }: Props) {
  const color = getImpactColor(impact);
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.label}>Estimated Impact</Text>
      <Text style={styles.value}>+{Math.round(impact)} mg/dL</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
