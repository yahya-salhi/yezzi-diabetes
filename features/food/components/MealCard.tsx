import { View, Text, Image, StyleSheet } from "react-native";
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

const MEAL_TYPE_COLORS: Record<string, string> = {
  breakfast: colors.warning,
  lunch: colors.info,
  dinner: colors.accent,
  snack: colors.success,
};

export function MealCard({ meal }: Props) {
  const impactColor = meal.estimated_impact >= 30
    ? colors.error
    : meal.estimated_impact >= 15
      ? colors.warning
      : colors.success;

  return (
    <View style={[styles.card, shadows.md]}>
      {meal.photo_uri && (
        <Image source={{ uri: meal.photo_uri }} style={styles.photo} />
      )}

      <View style={styles.body}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.foodName} numberOfLines={2}>{meal.food_name}</Text>
            <View style={styles.metaRow}>
              <View style={[styles.typeDot, { backgroundColor: MEAL_TYPE_COLORS[meal.meal_type] ?? colors.textMuted }]} />
              <Text style={styles.time}>{meal.time}</Text>
              <Badge label={MEAL_TYPE_LABELS[meal.meal_type] ?? meal.meal_type} />
            </View>
          </View>
          <View style={[styles.impactBadge, { backgroundColor: impactColor + "18" }]}>
            <Text style={[styles.impactValue, { color: impactColor }]}>+{Math.round(meal.estimated_impact)}</Text>
            <Text style={[styles.impactUnit, { color: impactColor }]}>mg/dL</Text>
          </View>
        </View>

        <View style={styles.nutritionGrid}>
          <View style={styles.nutrient}>
            <Text style={styles.nutrientValue}>{Math.round(meal.calories)}</Text>
            <Text style={styles.nutrientLabel}>Calories</Text>
          </View>
          <View style={styles.nutrient}>
            <Text style={styles.nutrientValue}>{Math.round(meal.carbs_g)}g</Text>
            <Text style={styles.nutrientLabel}>Carbs</Text>
          </View>
          {meal.protein_g != null && (
            <View style={styles.nutrient}>
              <Text style={styles.nutrientValue}>{Math.round(meal.protein_g)}g</Text>
              <Text style={styles.nutrientLabel}>Protein</Text>
            </View>
          )}
          {meal.fat_g != null && (
            <View style={styles.nutrient}>
              <Text style={styles.nutrientValue}>{Math.round(meal.fat_g)}g</Text>
              <Text style={styles.nutrientLabel}>Fat</Text>
            </View>
          )}
        </View>

        {meal.notes && (
          <Text style={styles.notes}>{meal.notes}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: 160,
    backgroundColor: colors.surfaceSecondary,
  },
  body: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.md,
    gap: spacing.sm,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  time: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textMuted,
  },
  impactBadge: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 64,
  },
  impactValue: {
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 22,
  },
  impactUnit: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: -1,
  },
  nutritionGrid: {
    flexDirection: "row",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: spacing.md,
  },
  nutrient: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  nutrientValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  nutrientLabel: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.textMuted,
  },
  notes: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textSecondary,
    fontStyle: "italic",
    lineHeight: 18,
  },
});
