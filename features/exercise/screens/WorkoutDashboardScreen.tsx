import { ScrollView, View, Text, StyleSheet } from "react-native";
import { colors, spacing, shadows } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { FlameIcon } from "@/components/ui/Icons";

const TEMPLATES = [
  { name: "PPL", days: "Push / Pull / Legs", status: "This week" },
  { name: "Upper-Lower", days: "Upper / Lower", status: "Next week" },
];

const RECENT_WORKOUTS = [
  { type: "Push", date: "Mon, Jun 29", exercises: 6, duration: "48 min" },
  { type: "Pull", date: "Wed, Jul 1", exercises: 5, duration: "42 min" },
];

const MILESTONES = [
  { label: "Week 3", sublabel: "on plan", active: true },
  { label: "12 sessions", sublabel: "this month", active: false },
  { label: "PB bench", sublabel: "+2.5 kg", active: false },
];

export function WorkoutDashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Workout</Text>
      <Text style={styles.subtitle}>Week 3 · on plan</Text>

      <View style={styles.streakRow}>
        <View style={styles.streakBadge}>
          <View style={styles.streakArc} />
          <FlameIcon size={22} color={colors.accent} strokeWidth={1.8} />
          <Text style={styles.streakValue}>5</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
        <View style={styles.streakStat}>
          <Text style={styles.streakStatValue}>12</Text>
          <Text style={styles.streakStatLabel}>sessions this month</Text>
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Weekly Templates</Text>
        <View style={styles.templateRow}>
          {TEMPLATES.map((t, i) => (
            <View key={i} style={[styles.templateCard, shadows.sm]}>
              <Text style={styles.templateName}>{t.name}</Text>
              <Text style={styles.templateDays}>{t.days}</Text>
              <View style={[styles.templateStatus, i === 0 && styles.templateStatusActive]}>
                <Text style={[styles.templateStatusText, i === 0 && styles.templateStatusTextActive]}>
                  {t.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        {RECENT_WORKOUTS.length === 0 ? (
          <Card>
            <EmptyState message="No workouts logged yet. Start your first session." />
          </Card>
        ) : (
          <View style={styles.workoutList}>
            {RECENT_WORKOUTS.map((w, i) => (
              <View key={i} style={[styles.workoutCard, shadows.sm]}>
                <View style={styles.workoutHeader}>
                  <Text style={styles.workoutType}>{w.type}</Text>
                  <Text style={styles.workoutDate}>{w.date}</Text>
                </View>
                <View style={styles.workoutStats}>
                  <Text style={styles.workoutStat}>{w.exercises} exercises</Text>
                  <Text style={styles.workoutStatDot}>·</Text>
                  <Text style={styles.workoutStat}>{w.duration}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View>
        <Text style={styles.sectionTitle}>Milestones</Text>
        <View style={styles.milestoneRow}>
          {MILESTONES.map((m, i) => (
            <View key={i} style={[styles.milestoneTile, m.active && styles.milestoneTileActive]}>
              <View style={[styles.milestoneDot, m.active && styles.milestoneDotActive]} />
              <Text style={[styles.milestoneLabel, m.active && styles.milestoneLabelActive]}>
                {m.label}
              </Text>
              <Text style={styles.milestoneSublabel}>{m.sublabel}</Text>
            </View>
          ))}
        </View>
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
    paddingBottom: spacing.xxxl,
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textMuted,
    marginTop: -spacing.md,
  },
  streakRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  streakBadge: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.xs,
  },
  streakArc: {
    display: "none",
  },
  streakValue: {
    fontSize: 34,
    fontWeight: "700",
    color: colors.accent,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textMuted,
  },
  streakStat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  streakStatValue: {
    fontSize: 34,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  streakStatLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textMuted,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  templateRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  templateCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  templateName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  templateDays: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textSecondary,
  },
  templateStatus: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
    backgroundColor: colors.surfaceSecondary,
  },
  templateStatusActive: {
    backgroundColor: colors.accentLight,
  },
  templateStatusText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textMuted,
  },
  templateStatusTextActive: {
    color: colors.accent,
  },
  workoutList: {
    gap: spacing.md,
  },
  workoutCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  workoutType: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  workoutDate: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textMuted,
  },
  workoutStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  workoutStat: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textSecondary,
  },
  workoutStatDot: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textMuted,
  },
  milestoneRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  milestoneTile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.xs,
  },
  milestoneTileActive: {
    backgroundColor: colors.accentLight,
  },
  milestoneDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  milestoneDotActive: {
    backgroundColor: colors.accent,
  },
  milestoneLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
  },
  milestoneLabelActive: {
    color: colors.accent,
  },
  milestoneSublabel: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.textMuted,
  },
});
