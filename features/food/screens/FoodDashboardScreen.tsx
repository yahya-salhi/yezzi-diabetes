import { ScrollView, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export function FoodDashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Food</Text>
      <Card>
        <EmptyState message="No meals logged today. Snap a photo to start." />
      </Card>
      <Text style={styles.sectionHeading}>Coming soon</Text>
      <Card>
        <Text style={styles.body}>Snap a photo of your meal to log carbs, protein, and estimated glucose impact.</Text>
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
