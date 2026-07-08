import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, shadows } from "@/theme/tokens";
import { Badge } from "@/components/ui/Badge";
import type { FoodLog } from "@/features/food/types";

type Props = {
  meal: FoodLog;
};

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export function MealCard({ meal }: Props) {
  return (
    <View style={[styles.card, shadows.sm]}>
      <View style={styles.topRow}>
        <Text style={styles.foodName}>{meal.food_name}</Text>
        <Badge label={MEAL_TYPE_LABELS[meal.meal_type] ?? meal.meal_type} />
      </View>
      <View style={styles.nutritionRow}>
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{Math.round(meal.calories)}</Text>
          <Text style={styles.nutritionLabel}>cal</Text>
        </View>
        <View style={styles.nutritionDivider} />
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>{Math.round(meal.carbs_g)}g</Text>
          <Text style={styles.nutritionLabel}>carbs</Text>
        </View>
        <View style={styles.nutritionDivider} />
        <View style={styles.nutritionItem}>
          <Text style={styles.nutritionValue}>+{Math.round(meal.estimated_impact)}</Text>
          <Text style={styles.nutritionLabel}>impact</Text>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.time}>{meal.time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.xl,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  nutritionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: spacing.md,
  },
  nutritionItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  nutritionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textMuted,
  },
  nutritionDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderLight,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  time: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
