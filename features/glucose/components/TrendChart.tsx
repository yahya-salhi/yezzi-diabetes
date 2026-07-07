import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { colors, spacing, shadows } from "@/theme/tokens";

type Props = {
  fastingData: { value: number; label: string }[];
  postMealData: { value: number; label: string }[];
};

export function TrendChart({ fastingData, postMealData }: Props) {
  const hasData = fastingData.length > 0 || postMealData.length > 0;

  if (!hasData) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.sectionTitle}>14-Day Trend</Text>
        <View style={[styles.emptyCard, shadows.sm]}>
          <Text style={styles.emptyText}>No trend data yet. Keep logging to see your 14-day pattern.</Text>
        </View>
      </View>
    );
  }

  const maxValue = Math.max(
    ...fastingData.map((d) => d.value),
    ...postMealData.map((d) => d.value),
    180,
  );
  const yMax = Math.ceil(maxValue / 50) * 50 + 50;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>14-Day Trend</Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.accent }]} />
            <Text style={styles.legendLabel}>Fasting</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.info }]} />
            <Text style={styles.legendLabel}>Post-meal</Text>
          </View>
        </View>
      </View>

      <View style={[styles.chartCard, shadows.sm]}>
        <LineChart
          data={fastingData}
          data2={postMealData}
          color1={colors.accent}
          color2={colors.info}
          dataPointsColor1={colors.accent}
          dataPointsColor2={colors.info}
          dataPointsShape="circle"
          dataPointsWidth={6}
          dataPointsHeight={6}
          startFillColor1={colors.accent}
          startFillColor2={colors.info}
          startOpacity={0.12}
          endOpacity={0.04}
          xAxisLabelTextStyle={styles.xLabel}
          yAxisTextStyle={styles.yLabel}
          yAxisOffset={0}
          maxValue={yMax}
          noOfSections={4}
          stepValue={yMax / 4}
          spacing={Math.max(40, Math.min(80, 500 / Math.max(fastingData.length, postMealData.length, 1)))}
          initialSpacing={16}
          endSpacing={16}
          scrollToEnd
          height={220}
          yAxisColor="transparent"
          xAxisColor={colors.borderLight}
          thickness={2.5}
          showReferenceLine1
          referenceLine1Position={70}
          referenceLine1Config={{
            color: colors.success,
            dashWidth: 4,
            dashGap: 4,
            thickness: 1,
            labelText: "70",
            labelTextStyle: { fontSize: 9, fontWeight: "500", color: colors.success, marginLeft: 4 },
          }}
          showReferenceLine2
          referenceLine2Position={140}
          referenceLine2Config={{
            color: colors.error,
            dashWidth: 4,
            dashGap: 4,
            thickness: 1,
            labelText: "140",
            labelTextStyle: { fontSize: 9, fontWeight: "500", color: colors.error, marginLeft: 4 },
          }}
          pointerConfig={{
            pointerStripHeight: 220,
            pointerStripWidth: 0,
            pointerColor: colors.textMuted,
            radius: 6,
            pointerLabelWidth: 60,
            pointerLabelHeight: 32,
            autoAdjustPointerLabelPosition: true,
            pointerLabelComponent: (items: { value: number }[]) => {
              const vals = items.filter(Boolean);
              if (vals.length === 0) return null;
              return (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>{vals[0].value}</Text>
                </View>
              );
            },
          }}
        />
        <View style={styles.rangeLegend}>
          <View style={styles.rangeRow}>
            <View style={[styles.rangeSwatch, { backgroundColor: colors.success }]} />
            <Text style={styles.rangeLabel}>Normal range 70–140 mg/dL</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  legend: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  xLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
  },
  yLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  tooltip: {
    backgroundColor: colors.textPrimary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tooltipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  rangeLegend: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: spacing.md,
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  rangeSwatch: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  rangeLabel: {
    fontSize: 11,
    fontWeight: "400",
    color: colors.textMuted,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});
