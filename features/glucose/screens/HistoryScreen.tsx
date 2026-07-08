import { useState, useMemo } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { format, subDays } from "date-fns";
import { colors, spacing } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ReadingCard } from "@/features/glucose/components/ReadingCard";
import { DecisionCard } from "@/features/glucose/components/DecisionCard";
import { useReadings } from "@/features/glucose/hooks/useReadings";
import { useAverages } from "@/features/glucose/hooks/useAverages";
import { usePatterns } from "@/features/glucose/hooks/usePatterns";
import type { ReadingType } from "@/features/glucose/types";

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

const AVERAGE_WINDOWS = [
  { key: "7d", label: "7d", value: "rolling7Day" as const },
  { key: "14d", label: "14d", value: "rolling14Day" as const },
  { key: "30d", label: "30d", value: "rolling30Day" as const },
  { key: "90d", label: "90d", value: "rolling90Day" as const },
];

export function HistoryScreen() {
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("14d");

  const range = DATE_RANGES.find((r) => r.key === dateRange)!;

  const filter = useMemo(
    () => ({
      type: filterType === "all" ? undefined : (filterType as ReadingType),
      startDate: range.days
        ? format(subDays(new Date(), range.days), "yyyy-MM-dd")
        : undefined,
    }),
    [filterType, dateRange],
  );

  const currentType = filterType === "all" ? undefined : (filterType as ReadingType);

  const { readings, loading } = useReadings(filter);
  const { rolling7Day, rolling14Day, rolling30Day, rolling90Day, loading: averagesLoading } = useAverages();
  const { alerts } = usePatterns(currentType);

  const rollingAverages = { rolling7Day, rolling14Day, rolling30Day, rolling90Day };

  const readingsByDay = useMemo(() => {
    const groups: Record<string, typeof readings> = {};
    for (const r of readings) {
      if (!groups[r.date]) groups[r.date] = [];
      groups[r.date].push(r);
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [readings]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>History</Text>

      {!averagesLoading && (
        <View style={styles.statStrip}>
          {AVERAGE_WINDOWS.map((w) => {
            const val = rollingAverages[w.value];
            return (
              <View key={w.key} style={styles.statItem}>
                <Text style={styles.statValue}>
                  {val !== null ? Math.round(val).toString() : "—"}
                </Text>
                <Text style={styles.statLabel}>{w.label}</Text>
              </View>
            );
          })}
        </View>
      )}

      <View>
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

      <View>
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

      {currentType !== undefined && alerts.slice(0, 2).map((alert, i) => (
        <DecisionCard key={i} alert={alert} />
      ))}

      <Text style={styles.sectionTitle}>
        {filterType === "all"
          ? "All Readings"
          : `${READING_TYPES.find((t) => t.key === filterType)?.label} Readings`}
      </Text>

      {loading ? (
        <LoadingSpinner />
      ) : readings.length === 0 ? (
        <Card>
          <EmptyState message="No readings match your filters." />
        </Card>
      ) : (
        <View style={styles.readingsGrouped}>
          {readingsByDay.map(([date, dayReadings]) => (
            <View key={date} style={styles.dayGroup}>
              <View style={styles.dayHeader}>
                <View style={styles.dayDot} />
                <Text style={styles.dayLabel}>
                  {date === format(new Date(), "yyyy-MM-dd")
                    ? "Today"
                    : date === format(subDays(new Date(), 1), "yyyy-MM-dd")
                    ? "Yesterday"
                    : format(new Date(date), "MMM d")}
                </Text>
              </View>
              <View style={styles.dayReadings}>
                {dayReadings.map((r) => (
                  <ReadingCard key={r.id} reading={r} />
                ))}
              </View>
            </View>
          ))}
        </View>
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
    gap: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  statStrip: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    gap: 0,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  readingsGrouped: {
    gap: spacing.xl,
  },
  dayGroup: {
    gap: spacing.sm,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  dayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dayReadings: {
    gap: spacing.sm,
  },
});
