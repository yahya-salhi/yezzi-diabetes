import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/tokens";
import type { GlucoseReading } from "@/features/glucose/types";
import { format } from "date-fns";

const READING_TYPE_LABELS: Record<string, string> = {
  fasting: "Fasting",
  pre_meal: "Pre-Meal",
  post_meal: "Post-Meal",
  bedtime: "Bedtime",
  other: "Other",
};

function getStatusColor(value: number, type: string): string {
  const isFasting = type === "fasting" || type === "pre_meal";
  if (isFasting) {
    if (value < 100) return colors.success;
    if (value < 126) return colors.warning;
    return colors.error;
  }
  if (value < 140) return colors.success;
  return colors.error;
}

type Props = {
  reading: GlucoseReading;
};

export function ReadingCard({ reading }: Props) {
  const statusColor = getStatusColor(reading.value, reading.type);

  return (
    <View style={[styles.card, { borderLeftColor: statusColor }]}>
      <View style={styles.header}>
        <Text style={styles.type}>{READING_TYPE_LABELS[reading.type] || reading.type}</Text>
        <Text style={styles.time}>
          {reading.date === format(new Date(), "yyyy-MM-dd") ? "Today" : reading.date} {reading.time}
        </Text>
      </View>
      <Text style={styles.value}>
        {Math.round(reading.value)} {reading.unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderRadius: 16,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  type: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  time: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.textMuted,
  },
  value: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
  },
});
