import { useState, useCallback } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { format, subDays } from "date-fns";
import { colors, spacing } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ReadingCard } from "@/features/glucose/components/ReadingCard";
import { DecisionCard } from "@/features/glucose/components/DecisionCard";
import { useFocusEffect } from "@react-navigation/native";
import { getReadingsFiltered } from "@/features/glucose/services/readings";
import { detectPatterns } from "@/features/glucose/services/patterns";
import { getDailyAverage } from "@/features/glucose/services/averages";
import type { GlucoseReading, ReadingType } from "@/features/glucose/types";
import type { PatternAlert } from "@/features/glucose/services/patterns";

const READING_TYPES: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "fasting", label: "Fasting" },
  { key: "pre_meal", label: "Pre-Meal" },
  { key: "post_meal", label: "Post-Meal" },
  { key: "bedtime", label: "Bedtime" },
  { key: "other", label: "Other" },
];

const DATE_RANGES: { key: string; label: string; days: number | null }[] = [
  { key: "7d", label: "7 days", days: 7 },
  { key: "14d", label: "14 days", days: 14 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "all", label: "All", days: null },
];

export function HistoryScreen() {
  const [readings, setReadings] = useState<GlucoseReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("14d");
  const [average, setAverage] = useState<number | null>(null);
  const [alerts, setAlerts] = useState<PatternAlert[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const range = DATE_RANGES.find((r) => r.key === dateRange)!;
      const startDate = range.days ? format(subDays(new Date(), range.days), "yyyy-MM-dd") : undefined;

      const data = await getReadingsFiltered(
        filterType === "all" ? undefined : filterType,
        startDate,
      );
      setReadings(data);

      const avg = data.length > 0
        ? data.reduce((sum, r) => sum + r.value, 0) / data.length
        : null;
      setAverage(avg);

      if (filterType !== "all") {
        const patternAlerts = await detectPatterns(filterType as ReadingType);
        setAlerts(patternAlerts);
      } else {
        setAlerts([]);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [filterType, dateRange]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {READING_TYPES.map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[styles.chip, filterType === t.key && styles.chipSelected]}
                onPress={() => setFilterType(t.key)}
              >
                <Text style={[styles.chipText, filterType === t.key && styles.chipTextSelected]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {DATE_RANGES.map((r) => (
              <TouchableOpacity
                key={r.key}
                style={[styles.chip, dateRange === r.key && styles.chipSelected]}
                onPress={() => setDateRange(r.key)}
              >
                <Text style={[styles.chipText, dateRange === r.key && styles.chipTextSelected]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {average !== null && (
        <Card style={styles.averageCard}>
          <Text style={styles.averageLabel}>Average</Text>
          <Text style={styles.averageValue}>{Math.round(average)} mg/dL</Text>
        </Card>
      )}

      {alerts.map((alert, i) => (
        <DecisionCard key={i} alert={alert} />
      ))}

      {loading ? (
        <LoadingSpinner />
      ) : readings.length === 0 ? (
        <EmptyState message="No readings match your filters." />
      ) : (
        readings.map((r) => <ReadingCard key={r.id} reading={r} />)
      )}
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
    gap: spacing.lg,
  },
  filterRow: {
    marginBottom: -spacing.sm,
  },
  chipRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.accent,
    backgroundColor: "#F0EDFF",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.accent,
  },
  averageCard: {
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
});
