import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/tokens";
import { Button } from "@/components/ui/Button";
import { getColor } from "@/features/glucose/services/ReadingClassifier";
import type { PatternAlert } from "@/features/glucose/services/patterns";

type Props = {
  alert: PatternAlert;
  onAction?: () => void;
  actionLabel?: string;
};

export function DecisionCard({ alert, onAction, actionLabel }: Props) {
  const accentColor = getColor(
    alert.severity === "alert" ? "high" : "borderline",
  );

  return (
    <View style={styles.card}>
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={styles.body}>
        <Text style={styles.title}>
          {alert.severity === "alert" ? "High" : "Elevated"} {alert.type.replace("_", " ")} readings
        </Text>
        <Text style={styles.message}>{alert.message}</Text>
        {actionLabel && onAction && (
          <View style={styles.actionWrap}>
            <Button title={actionLabel} variant="ghost" onPress={onAction} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: "hidden",
  },
  accentBar: {
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  body: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.xs,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  message: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actionWrap: {
    marginTop: spacing.sm,
  },
});
