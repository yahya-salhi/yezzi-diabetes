import { ScrollView, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export function WorkoutDashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Workout</Text>
      <Card>
        <EmptyState message="No workouts logged yet. Start your first session." />
      </Card>
      <Text style={styles.sectionHeading}>Coming soon</Text>
      <Card>
        <Text style={styles.body}>Log strength and cardio sessions. Track sets, reps, and duration.</Text>
      </Card>
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
  screenTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  body: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
