import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/tokens";
import { Button } from "@/components/ui/Button";
import { getThresholdColor } from "@/features/glucose/services/thresholds";
import type { PatternAlert } from "@/features/glucose/services/patterns";

type Props = {
  alert: PatternAlert;
  onAction?: () => void;
  actionLabel?: string;
};

export function DecisionCard({ alert, onAction, actionLabel }: Props) {
  const borderColor = getThresholdColor(
    alert.severity === "alert" ? "high" : "borderline",
  );

  return (
    <View style={[styles.card, { borderLeftColor: borderColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: borderColor }]}>
          {alert.severity === "alert" ? "▲" : "●"} {alert.severity === "alert" ? "High" : "Elevated"} {alert.type.replace("_", " ")} readings
        </Text>
      </View>
      <Text style={styles.message}>{alert.message}</Text>
      {actionLabel && onAction && (
        <Button title={actionLabel} variant="secondary" onPress={onAction} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderRadius: 16,
    padding: spacing.xl,
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  message: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
