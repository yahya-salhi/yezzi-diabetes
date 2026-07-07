import { ScrollView, View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";
import { colors, spacing } from "@/theme/tokens";
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
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.date}>{displayDate}</Text>
      </View>

      {alerts.map((alert, i) => (
        <DecisionCard key={i} alert={alert} actionLabel="View History" onAction={() => navigation.navigate("History")} />
      ))}

      {readings.length === 0 ? (
        <Card>
          <EmptyState
            message="No readings today. Tap Add Reading to start."
            actionLabel="Add Reading"
            onAction={() => navigation.navigate("AddReading")}
          />
        </Card>
      ) : (
        readings.map((r) => <ReadingCard key={r.id} reading={r} />)
      )}

      <View style={styles.averagesRow}>
        <Card style={styles.averageCard}>
          <Text style={styles.averageLabel}>Today</Text>
          <Text style={styles.averageValue}>
            {averagesLoading ? "—" : dailyAverage ? Math.round(dailyAverage).toString() : "—"}
          </Text>
        </Card>
        <Card style={styles.averageCard}>
          <Text style={styles.averageLabel}>7-day</Text>
          <Text style={styles.averageValue}>
            {averagesLoading ? "—" : rolling7Day ? Math.round(rolling7Day).toString() : "—"}
          </Text>
        </Card>
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
    padding: spacing.lg,
    gap: spacing.xl,
  },
  header: {
    gap: spacing.xs,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  date: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textMuted,
  },
  averagesRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  averageCard: {
    flex: 1,
    alignItems: "center",
  },
  averageLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  averageValue: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  actions: {
    gap: spacing.md,
  },
});
