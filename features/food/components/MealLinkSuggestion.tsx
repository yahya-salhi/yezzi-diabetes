import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, shadows } from "@/theme/tokens";
import { Button } from "@/components/ui/Button";

type Props = {
  mealName: string;
  estimatedImpact: number;
  onAccept?: () => void;
  onDismiss?: () => void;
};

export function MealLinkSuggestion({ mealName, estimatedImpact, onAccept, onDismiss }: Props) {
  return (
    <View style={[styles.card, shadows.sm]}>
      <View style={styles.accentBar} />
      <View style={styles.body}>
        <Text style={styles.title}>Link to meal?</Text>
        <Text style={styles.message}>
          We found a recent meal — "{mealName}" — with an estimated impact of +{Math.round(estimatedImpact)} mg/dL. Link this reading to track actual vs. estimated impact.
        </Text>
        <View style={styles.actions}>
          {onDismiss && <Button title="Skip" variant="ghost" onPress={onDismiss} />}
          {onAccept && <Button title="Link Meal" onPress={onAccept} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    flexDirection: "row",
    overflow: "hidden",
  },
  accentBar: {
    width: 4,
    backgroundColor: colors.info,
  },
  body: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.info,
  },
  message: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
