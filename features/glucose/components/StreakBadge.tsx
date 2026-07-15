import { View, Text, StyleSheet } from "react-native";
import { FlameIcon } from "@/components/ui/Icons";
import { colors, spacing, typography } from "@/theme/tokens";
import type { Milestone } from "@/features/glucose/services/streaks";

type Props = {
  streak: number;
  milestones: Milestone[];
};

export function StreakBadge({ streak, milestones }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.arcOuter}>
        <View style={styles.arc} />
        <View style={styles.badgeInner}>
          <FlameIcon size={20} color={colors.accent} />
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>
            {streak === 1 ? "day" : "days"}
          </Text>
        </View>
      </View>

      <View style={styles.milestoneRow}>
        {milestones.map((m) => (
          <View
            key={m.days}
            style={[styles.milestone, m.reached && styles.milestoneReached]}
          >
            <Text
              style={[
                styles.milestoneText,
                m.reached && styles.milestoneTextReached,
              ]}
            >
              {m.days}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.xl,
  },
  arcOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  arc: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  streakNumber: {
    ...typography.statNumber,
    fontSize: 18,
    lineHeight: 20,
  },
  streakLabel: {
    ...typography.caption,
    fontSize: 10,
    lineHeight: 12,
    marginTop: -2,
  },
  milestoneRow: {
    flex: 1,
    flexDirection: "row",
    gap: spacing.sm,
  },
  milestone: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.surfaceSecondary,
  },
  milestoneReached: {
    backgroundColor: colors.accentLight,
  },
  milestoneText: {
    ...typography.badge,
    fontSize: 12,
    color: colors.textMuted,
  },
  milestoneTextReached: {
    color: colors.accent,
  },
});
