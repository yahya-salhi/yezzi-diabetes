import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, spacing, shadows } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { MealCard } from "@/features/food/components/MealCard";
import { MealLinkSuggestion } from "@/features/food/components/MealLinkSuggestion";
import type { FoodLog } from "@/features/food/types";

type Nav = NativeStackNavigationProp<any>;

const MOCK_MEALS: FoodLog[] = [];

const MOCK_RECENT: FoodLog[] = [];

export function FoodDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const today = format(new Date(), "EEEE, MMM d");
  const hasMeals = MOCK_MEALS.length > 0;
  const hasRecent = MOCK_RECENT.length > 0;

  return (
    <View style={styles.root}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Food</Text>
          <Text style={styles.date}>{today}</Text>
        </View>

        <View style={[styles.totalsCard, shadows.md]}>
          <Text style={styles.totalsTitle}>Today's Totals</Text>
          <View style={styles.totalsRow}>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>—</Text>
              <Text style={styles.totalLabel}>calories</Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>—</Text>
              <Text style={styles.totalLabel}>carbs (g)</Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>—</Text>
              <Text style={styles.totalLabel}>impact</Text>
            </View>
          </View>
        </View>

        <MealLinkSuggestion
          mealName="Chicken Salad"
          estimatedImpact={28}
        />

        <View>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          {hasMeals ? (
            MOCK_MEALS.map((meal) => <MealCard key={meal.id} meal={meal} />)
          ) : (
            <Card>
              <EmptyState message="No meals logged today. Snap a photo to get started." />
            </Card>
          )}
        </View>

        <View>
          <Text style={styles.sectionTitle}>Recent Meals</Text>
          {hasRecent ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.recentRow}>
                {MOCK_RECENT.map((meal) => (
                  <View key={meal.id} style={styles.recentCard}>
                    <View style={styles.recentThumb} />
                    <Text style={styles.recentName} numberOfLines={1}>{meal.food_name}</Text>
                    <Text style={styles.recentImpact}>+{Math.round(meal.estimated_impact)} mg/dL</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <Card>
              <EmptyState message="Your recent meals will appear here." />
            </Card>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => navigation.navigate("SnapMeal")}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.xxl,
    paddingBottom: 100,
  },
  header: {
    gap: spacing.xs,
    paddingTop: spacing.md,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  date: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textMuted,
  },
  totalsCard: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  totalsTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },
  totalsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalItem: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
  },
  totalValue: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255,255,255,0.6)",
  },
  totalDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  recentRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  recentCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    width: 140,
    gap: spacing.sm,
    ...shadows.sm,
  },
  recentThumb: {
    width: "100%",
    height: 80,
    borderRadius: 10,
    backgroundColor: colors.surfaceSecondary,
  },
  recentName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  recentImpact: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textMuted,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.lg,
  },
  fabIcon: {
    fontSize: 28,
    fontWeight: "400",
    color: "#FFFFFF",
    lineHeight: 30,
  },
});
