import { View, Text, Modal, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/tokens";
import type { GlucoseReading } from "@/features/glucose/types";

type Props = {
  visible: boolean;
  readings: GlucoseReading[];
  rangeLabel: string;
  onShare: () => void;
  onClose: () => void;
  loading: boolean;
};

function round(value: number): string {
  return Math.round(value).toString();
}

function inRangeColor(value: number, low: number, high: number): string {
  if (value < low) return colors.warning;
  if (value > high) return colors.error;
  return colors.success;
}

function barWidth(value: number, max: number): number {
  return Math.max(4, Math.min(100, (value / max) * 100));
}

function computeStats(readings: GlucoseReading[]) {
  const fasting = readings.filter((r) => r.type === "fasting");
  const postMeal = readings.filter((r) => r.type === "post_meal");

  const avg = (arr: GlucoseReading[]): number | null => {
    if (arr.length === 0) return null;
    return arr.reduce((sum, r) => sum + r.value, 0) / arr.length;
  };

  return {
    fastingAvg: avg(fasting),
    postMealAvg: avg(postMeal),
    overallAvg: avg(readings),
    fastingCount: fasting.length,
    postMealCount: postMeal.length,
    totalCount: readings.length,
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildTrendData(readings: GlucoseReading[]) {
  const byDate = new Map<string, { fasting: number | null; postMeal: number | null }>();

  for (const r of readings) {
    const existing = byDate.get(r.date) ?? { fasting: null, postMeal: null };
    if (r.type === "fasting" && existing.fasting === null) {
      existing.fasting = r.value;
    }
    if (r.type === "post_meal" && existing.postMeal === null) {
      existing.postMeal = r.value;
    }
    byDate.set(r.date, existing);
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, vals]) => ({ date, ...vals }));
}

export function PdfPreviewModal({ visible, readings, rangeLabel, onShare, onClose, loading }: Props) {
  const stats = computeStats(readings);
  const trendData = buildTrendData(readings);
  const maxValue = Math.max(...readings.map((r) => r.value), 200);

  const now = new Date();
  const generatedDate = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const renderAvgRow = (label: string, value: number | null, count: number) => {
    if (value === null) return null;
    return (
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, { color: colors.textPrimary }]}>{round(value)} mg/dL</Text>
        <Text style={styles.statCount}>{count} readings</Text>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>PDF Report</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.reportHeader}>
            <Text style={styles.reportTitle}>Glucose Report</Text>
            <Text style={styles.reportSubtitle}>{rangeLabel} · Generated {generatedDate}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Averages</Text>
            <View style={styles.card}>
              {renderAvgRow("Fasting", stats.fastingAvg, stats.fastingCount)}
              {renderAvgRow("Post-Meal", stats.postMealAvg, stats.postMealCount)}
              {renderAvgRow("Overall", stats.overallAvg, stats.totalCount)}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trend</Text>
            <View style={styles.card}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>Date</Text>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>Fasting</Text>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>Post-Meal</Text>
              </View>
              {trendData.slice(0, 14).map((row, idx) => (
                <View key={row.date} style={[styles.tableRow, idx < trendData.length - 1 && styles.tableRowBorder]}>
                  <Text style={[styles.tableCell, { flex: 1.2 }]}>{formatDate(row.date)}</Text>
                  <View style={[styles.viewCell, { flex: 2 }]}>
                    {row.fasting !== null ? (
                      <View style={styles.barRow}>
                        <View
                          style={[
                            styles.bar,
                            {
                              width: `${barWidth(row.fasting, maxValue)}%`,
                              backgroundColor: inRangeColor(row.fasting, 70, 100),
                            },
                          ]}
                        />
                        <Text style={styles.barValue}>{round(row.fasting)}</Text>
                      </View>
                    ) : (
                      <Text style={styles.emptyValue}>—</Text>
                    )}
                  </View>
                  <View style={[styles.viewCell, { flex: 2 }]}>
                    {row.postMeal !== null ? (
                      <View style={styles.barRow}>
                        <View
                          style={[
                            styles.bar,
                            {
                              width: `${barWidth(row.postMeal, maxValue)}%`,
                              backgroundColor: inRangeColor(row.postMeal, 70, 140),
                            },
                          ]}
                        />
                        <Text style={styles.barValue}>{round(row.postMeal)}</Text>
                      </View>
                    ) : (
                      <Text style={styles.emptyValue}>—</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.disclaimer}>
            Generated by YeZZi · For informational purposes only
          </Text>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.shareButton, loading && styles.shareButtonDisabled]}
            onPress={onShare}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.shareText}>Share PDF</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  closeButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  closeText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.accent,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    gap: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  reportHeader: {
    alignItems: "center",
    gap: spacing.xs,
  },
  reportTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  reportSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: "hidden",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  statLabel: {
    fontSize: 15,
    color: colors.textPrimary,
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  statCount: {
    fontSize: 13,
    color: colors.textMuted,
    flex: 0.8,
    textAlign: "right",
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  tableRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tableCell: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  viewCell: {
    // no text styles — used on View containers
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  bar: {
    height: 8,
    borderRadius: 4,
  },
  barValue: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  emptyValue: {
    fontSize: 12,
    color: colors.textMuted,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
    paddingTop: spacing.lg,
  },
  footer: {
    padding: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  shareButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  shareButtonDisabled: {
    opacity: 0.6,
  },
  shareText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
