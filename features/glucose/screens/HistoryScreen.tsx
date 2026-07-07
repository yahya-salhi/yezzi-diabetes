import { useState, useCallback } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { format, subDays } from "date-fns";
import { colors, spacing, shadows } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ReadingCard } from "@/features/glucose/components/ReadingCard";
import { DecisionCard } from "@/features/glucose/components/DecisionCard";
import { useFocusEffect } from "@react-navigation/native";
import { createSqliteGlucoseReadings } from "@/features/glucose/GlucoseReadings";
import { detectPatterns } from "@/features/glucose/services/patterns";
import type { GlucoseReading, ReadingType } from "@/features/glucose/types";
import type { PatternAlert } from "@/features/glucose/services/patterns";

const readingsRepo = createSqliteGlucoseReadings();

const READING_TYPES: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "fasting", label: "Fasting" },
  { key: "pre_meal", label: "Pre-Meal" },
  { key: "post_meal", label: "Post-Meal" },
  { key: "bedtime", label: "Bedtime" },
  { key: "other", label: "Other" },
];

const DATE_RANGES: { key: string; label: string; days: number | null }[] = [
  { key: "7d", label: "7d", days: 7 },
  { key: "14d", label: "14d", days: 14 },
  { key: "30d", label: "30d", days: 30 },
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

      const data = await readingsRepo.query({
        type: filterType === "all" ? undefined : (filterType as ReadingType),
        startDate,
      });
      setReadings(data);

      const avg = data.length > 0
        ? data.reduce((sum: number, r: GlucoseReading) => sum + r.value, 0) / data.length
        : null;
      setAverage(avg);

      if (filterType !== "all") {
        const allRecent = await readingsRepo.query({ limit: 20, orderBy: "date_desc" });
        const patternAlerts = detectPatterns(allRecent, filterType as ReadingType);
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
      <View style={styles.filterSection}>
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

      <View style={styles.filterSection}>
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
        <View style={[styles.averageCard, shadows.sm]}>
          <Text style={styles.averageLabel}>Average</Text>
          <Text style={styles.averageValue}>{Math.round(average)}</Text>
          <Text style={styles.averageUnit}>mg/dL</Text>
        </View>
      )}

      {alerts.map((alert, i) => (
        <DecisionCard key={i} alert={alert} />
      ))}

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>
        {filterType === "all" ? "All Readings" : ((READING_TYPES.find(t => t.key === filterType)?.label) + " Readings")}
      </Text>

      {loading ? (
        <LoadingSpinner />
      ) : readings.length === 0 ? (
        <Card>
          <EmptyState message="No readings match your filters." />
        </Card>
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
    padding: spacing.xl,
    gap: spacing.xxl,
  },
  filterSection: {
    marginBottom: spacing.xs,
  },
  chipRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentLight,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.accent,
    fontWeight: "600",
  },
  averageCard: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.xs,
  },
  averageLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  averageValue: {
    fontSize: 42,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  averageUnit: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255,255,255,0.6)",
    marginTop: -spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
