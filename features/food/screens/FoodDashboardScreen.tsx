import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { FoodStackParamList } from "@/navigation/types";
import { colors, spacing, shadows } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { MealCard } from "@/features/food/components/MealCard";
import { MealLinkSuggestion } from "@/features/food/components/MealLinkSuggestion";
import { CameraIcon } from "@/components/ui/Icons";
import { useInsights } from "@/features/food/hooks/useInsights";
import type { FoodLog } from "@/features/food/types";

type Nav = NativeStackNavigationProp<FoodStackParamList>;

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

const MOCK_MEALS: FoodLog[] = [];

const MOCK_RECENT: FoodLog[] = [];

export function FoodDashboardScreen() {
  const navigation = useNavigation<Nav>();
  const today = format(new Date(), "EEEE, MMM d");
  const { topSpikes } = useInsights();
  const hasMeals = MOCK_MEALS.length > 0;
  const hasRecent = MOCK_RECENT.length > 0;
  const hasSpikes = topSpikes.length >= 2;

  return (
    <View style={styles.root}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>Food</Text>
        <Text style={styles.date}>{today}</Text>

        {!hasMeals && (
          <Card>
            <EmptyState message="No meals logged today. Snap a photo to get started." />
          </Card>
        )}

        {hasMeals && (
          <View>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <View style={styles.mealsList}>
              {MOCK_MEALS.map((meal) => <MealCard key={meal.id} meal={meal} />)}
            </View>
          </View>
        )}

        {hasSpikes && (
        <View style={styles.insightCard}>
          <View style={styles.insightAccent} />
          <View style={styles.insightBody}>
            <Text style={styles.insightTitle}>Highest Spikes This Week</Text>
            <View style={styles.insightList}>
              {topSpikes.map((s) => (
                <View key={s.meal_id} style={styles.insightRow}>
                  <View style={styles.insightLeft}>
                    <Text style={styles.insightMeal}>{s.food_name}</Text>
                    <View style={styles.insightMeta}>
                      <Badge label={MEAL_TYPE_LABELS[s.meal_type] ?? s.meal_type} />
                      <Text style={styles.insightTime}>{s.meal_time}</Text>
                    </View>
                  </View>
                  <View style={styles.insightRight}>
                    <Text style={styles.insightImpact}>+{Math.round(s.actual_impact)} mg/dL</Text>
                    <Text style={styles.insightEstimate}>Est. +{Math.round(s.estimated_impact)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
        )}

        <View>
          <Text style={styles.sectionTitle}>Recent Meals</Text>
          {hasRecent ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.recentRow}>
                {MOCK_RECENT.map((meal) => (
                  <TouchableOpacity key={meal.id} style={styles.photoCard} activeOpacity={0.8}>
                    <View style={styles.photoThumb}>
                      <View style={styles.photoScrim} />
                      <Text style={styles.photoImpact}>+{Math.round(meal.estimated_impact)}</Text>
                    </View>
                    <Text style={styles.photoName} numberOfLines={1}>{meal.food_name}</Text>
                    <Text style={styles.photoCarbs}>{Math.round(meal.carbs_g)}g carbs</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          ) : (
            <EmptyState message="Your recent meals will appear here." />
          )}
        </View>

        {hasMeals && (
          <MealLinkSuggestion mealName="Chicken Salad" estimatedImpact={28} />
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("SnapMeal")}
      >
        <CameraIcon size={28} color="#FFFFFF" strokeWidth={1.8} />
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
    paddingBottom: 120,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  date: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textMuted,
    marginTop: -spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  mealsList: {
    gap: spacing.md,
  },
  insightCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: "hidden",
  },
  insightAccent: {
    width: 4,
    backgroundColor: colors.info,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  insightBody: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.md,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  insightList: {
    gap: spacing.sm,
  },
  insightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  insightLeft: {
    flex: 1,
    gap: spacing.xs,
    marginRight: spacing.md,
  },
  insightMeal: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  insightMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  insightTime: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.textMuted,
  },
  insightRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  insightImpact: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.info,
  },
  insightEstimate: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.textMuted,
  },
  recentRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  photoCard: {
    width: 160,
    gap: spacing.sm,
  },
  photoThumb: {
    width: 160,
    height: 120,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  photoScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 14,
  },
  photoImpact: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  photoName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  photoCarbs: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textMuted,
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: spacing.xl,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.lg,
  },
});
