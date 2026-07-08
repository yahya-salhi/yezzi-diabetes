import { ScrollView, View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";
import { colors, spacing } from "@/theme/tokens";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ReadingCard } from "@/features/glucose/components/ReadingCard";
import { DecisionCard } from "@/features/glucose/components/DecisionCard";
import { useDashboardData } from "@/features/glucose/hooks/useDashboardData";
import { usePreferences } from "@/features/onboarding/hooks/usePreferences";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { GlucoseStackParamList } from "@/navigation/types";
import { GlucoseValue } from "@/features/glucose/domain/GlucoseValue";
import { classifyReading, getLabel, thresholdsFromPreferences } from "@/features/glucose/services/readingStatus";
import { getColor } from "@/features/glucose/services/readingDisplay";

type Nav = NativeStackNavigationProp<GlucoseStackParamList>;

export function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const today = format(new Date(), "yyyy-MM-dd");
  const { preferences } = usePreferences();
  const { readings, dailyAverage, alerts, loading } = useDashboardData(today, preferences);
  const displayDate = format(new Date(), "EEEE, MMM d");

  const thresholds = preferences ? thresholdsFromPreferences(preferences) : undefined;
  const weeklyThreshold = thresholds?.post_meal.normalUpper ?? 140;

  if (loading) return <LoadingSpinner />;

  const latestReading = readings.length > 0 ? readings[readings.length - 1] : null;
  const latestGv = latestReading ? GlucoseValue.fromMgdl(latestReading.value) : null;
  const latestStatus = latestReading
    ? classifyReading(latestReading.value, latestReading.type, thresholds)
    : null;
  const latestStatusColor = latestStatus ? getColor(latestStatus) : colors.textMuted;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Today</Text>
      <Text style={styles.date}>{displayDate}</Text>

      {latestReading ? (
        <View style={styles.heroCard}>
          <View style={[styles.heroAccentBar, { backgroundColor: latestStatusColor }]} />
          <View style={styles.heroBody}>
            <Text style={styles.heroLabel}>
              {latestReading.type === "fasting" ? "Fasting" : latestReading.type === "post_meal" ? "Post-Meal" : "Latest"}
            </Text>
            <Text style={[styles.heroValue, { color: latestStatusColor }]}>
              {latestGv?.toDisplay(latestReading.unit)}
              <Text style={styles.heroUnit}> {latestReading.unit}</Text>
            </Text>
            <Text style={[styles.heroStatus, { color: latestStatusColor }]}>
              {latestStatus ? getLabel(latestStatus) : ""}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.heroEmptyCard}>
          <Text style={styles.heroEmptyValue}>—</Text>
          <Text style={styles.heroEmptyLabel}>No readings today</Text>
        </View>
      )}

      {dailyAverage && (
        <View style={styles.rangeSummary}>
          <View style={[styles.rangeDot, { backgroundColor: dailyAverage < weeklyThreshold ? colors.success : colors.warning }]} />
          <Text style={styles.rangeText}>
            {dailyAverage < weeklyThreshold ? "Good range this week" : "Above target this week"}
          </Text>
        </View>
      )}

      {alerts.slice(0, 2).map((alert, i) => (
        <DecisionCard key={i} alert={alert} actionLabel="View History" onAction={() => navigation.navigate("History")} />
      ))}

      <View>
        <Text style={styles.sectionTitle}>Today's Readings</Text>
        <View style={styles.readingsList}>
          {readings.length === 0 ? (
            <EmptyState
              message="Tap below to log your first reading."
              actionLabel="Add Reading"
              onAction={() => navigation.navigate("AddReading")}
            />
          ) : (
            readings.map((r) => <ReadingCard key={r.id} reading={r} thresholds={thresholds} />)
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <Button title="Add Reading" onPress={() => navigation.navigate("AddReading")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.xxl,
    paddingBottom: spacing.xxxl,
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
  heroCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: "hidden",
  },
  heroAccentBar: {
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  heroBody: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.xs,
  },
  heroLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  heroValue: {
    fontSize: 42,
    fontWeight: "700",
    lineHeight: 48,
  },
  heroUnit: {
    fontSize: 18,
    fontWeight: "500",
  },
  heroStatus: {
    fontSize: 15,
    fontWeight: "500",
  },
  heroEmptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.xxl,
    alignItems: "center",
    gap: spacing.sm,
  },
  heroEmptyValue: {
    fontSize: 42,
    fontWeight: "700",
    color: colors.textMuted,
  },
  heroEmptyLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  rangeSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  rangeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rangeText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  readingsList: {
    gap: spacing.md,
  },
  actions: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
});
