import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/tokens";
import type { GlucoseReading } from "@/features/glucose/types";
import { format } from "date-fns";
import { GlucoseValue } from "@/features/glucose/domain/GlucoseValue";
import { classifyReading, getColor, getLabel } from "@/features/glucose/services/ReadingClassifier";
import type { ThresholdMap } from "@/features/glucose/services/ReadingClassifier";

const READING_TYPE_LABELS: Record<string, string> = {
  fasting: "Fasting",
  pre_meal: "Pre-Meal",
  post_meal: "Post-Meal",
  bedtime: "Bedtime",
  other: "Other",
};

type Props = {
  reading: GlucoseReading;
  thresholds?: ThresholdMap;
};

export function ReadingCard({ reading, thresholds }: Props) {
  const gv = GlucoseValue.fromMgdl(reading.value);
  const status = classifyReading(reading.value, reading.type, thresholds);
  const statusColor = getColor(status);
  const label = getLabel(status);

  return (
    <View style={styles.card}>
      <View style={[styles.accentBar, { backgroundColor: statusColor }]} />
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.type}>{READING_TYPE_LABELS[reading.type] || reading.type}</Text>
          <Text style={styles.time}>
            {reading.date === format(new Date(), "yyyy-MM-dd") ? "Today" : reading.date} {reading.time}
          </Text>
        </View>
        <Text style={[styles.value, { color: statusColor }]}>
          {gv.toDisplay(reading.unit)} <Text style={styles.unit}>{reading.unit}</Text>
        </Text>
        <Text style={[styles.statusLabel, { color: statusColor }]}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: "hidden",
  },
  accentBar: {
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  body: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  type: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  time: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textMuted,
  },
  value: {
    fontSize: 32,
    fontWeight: "700",
  },
  unit: {
    fontSize: 16,
    fontWeight: "500",
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
});
