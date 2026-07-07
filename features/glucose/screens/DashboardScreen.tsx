import { ScrollView, View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";
import { colors, spacing, shadows } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ReadingCard } from "@/features/glucose/components/ReadingCard";
import { TrendChart } from "@/features/glucose/components/TrendChart";
import { useReadings } from "@/features/glucose/hooks/useReadings";
import { useAverages } from "@/features/glucose/hooks/useAverages";
import { useTrends } from "@/features/glucose/hooks/useTrends";
import { usePatterns } from "@/features/glucose/hooks/usePatterns";
import { DecisionCard } from "@/features/glucose/components/DecisionCard";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Nav = NativeStackNavigationProp<any>;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const today = format(new Date(), "yyyy-MM-dd");
  const { readings, loading: readingsLoading } = useReadings(today);
  const { dailyAverage, rolling7Day, loading: averagesLoading } = useAverages();
  const { fastingData, postMealData } = useTrends();
  const { alerts } = usePatterns();
  const displayDate = format(new Date(), "EEEE, MMM d");

  if (readingsLoading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.date}>{displayDate}</Text>
        </View>
        <View style={[styles.avatarCircle, shadows.sm]}>
          <Text style={styles.avatarLetter}>Y</Text>
        </View>
      </View>

      <View style={[styles.todayOverview, shadows.md]}>
        <Text style={styles.overviewLabel}>Today's Average</Text>
        <Text style={styles.overviewValue}>
          {averagesLoading ? "—" : dailyAverage ? Math.round(dailyAverage).toString() : "—"}
        </Text>
        <Text style={styles.overviewUnit}>mg/dL</Text>
        {!readingsLoading && readings.length > 0 && (
          <View style={styles.readingCountBadge}>
            <Text style={styles.readingCountText}>{readings.length} reading{readings.length !== 1 ? "s" : ""} today</Text>
          </View>
        )}
      </View>

      {alerts.map((alert, i) => (
        <DecisionCard key={i} alert={alert} actionLabel="View History" onAction={() => navigation.navigate("History")} />
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Readings</Text>
        {readings.length > 0 && (
          <Text style={styles.sectionAction}>See all</Text>
        )}
      </View>

      {readings.length === 0 ? (
        <Card>
          <EmptyState
            message="No readings today. Tap below to log your first one."
            actionLabel="Add Reading"
            onAction={() => navigation.navigate("AddReading")}
          />
        </Card>
      ) : (
        readings.map((r) => <ReadingCard key={r.id} reading={r} />)
      )}

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Averages</Text>
      <View style={styles.averagesRow}>
        <View style={[styles.averageCard, shadows.sm]}>
          <Text style={styles.averageLabel}>Today</Text>
          <Text style={[styles.averageValue, { color: colors.accent }]}>
            {averagesLoading ? "—" : dailyAverage ? Math.round(dailyAverage).toString() : "—"}
          </Text>
        </View>
        <View style={[styles.averageCard, shadows.sm]}>
          <Text style={styles.averageLabel}>7-day</Text>
          <Text style={[styles.averageValue, { color: colors.accent }]}>
            {averagesLoading ? "—" : rolling7Day ? Math.round(rolling7Day).toString() : "—"}
          </Text>
        </View>
      </View>

      <TrendChart fastingData={fastingData} postMealData={postMealData} />

      <View style={styles.actions}>
        <Button title="Add Reading" onPress={() => navigation.navigate("AddReading")} />
        <Button
          title="View History"
          variant="secondary"
          onPress={() => navigation.navigate("History")}
        />
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: spacing.md,
  },
  headerLeft: {
    gap: spacing.xs,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  date: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textMuted,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.accent,
  },
  todayOverview: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: spacing.xxl,
    alignItems: "center",
    gap: spacing.xs,
  },
  overviewLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  overviewValue: {
    fontSize: 52,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 60,
  },
  overviewUnit: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255,255,255,0.6)",
    marginTop: -spacing.xs,
  },
  readingCountBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginTop: spacing.md,
  },
  readingCountText: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255,255,255,0.85)",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.accent,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  averagesRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  averageCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.xs,
  },
  averageLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  averageValue: {
    fontSize: 34,
    fontWeight: "700",
  },
  actions: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
});
