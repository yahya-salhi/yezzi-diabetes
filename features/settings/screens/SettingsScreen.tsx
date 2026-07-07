import { ScrollView, View, Text, StyleSheet } from "react-native";
import { colors, spacing, shadows } from "@/theme/tokens";

export function SettingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Settings</Text>

      <View>
        <Text style={styles.sectionHeading}>Preferences</Text>
        <View style={[styles.card, shadows.sm]}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Unit</Text>
            <Text style={styles.settingValue}>mg/dL</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Target ranges</Text>
            <Text style={styles.settingValue}>IDF defaults</Text>
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.sectionHeading}>About</Text>
        <View style={[styles.card, shadows.sm]}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Data</Text>
            <Text style={styles.settingValue}>Stored on device</Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>
        YeZZ helps you manage diabetes with glucose tracking, meal logging, and exercise insights. All data stays on your device.
      </Text>
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
    fontSize: 22,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.xl,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textPrimary,
  },
  settingValue: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  footer: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textMuted,
    lineHeight: 18,
    textAlign: "center",
  },
});
