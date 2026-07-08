import { ScrollView, View, Text, Switch, StyleSheet } from "react-native";
import { useState } from "react";
import { colors, spacing } from "@/theme/tokens";
import { ChevronRightIcon } from "@/components/ui/Icons";

export function SettingsScreen() {
  const [appearanceDark, setAppearanceDark] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Settings</Text>

      <View>
        <Text style={styles.sectionHeader}>PREFERENCES</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.label}>Unit</Text>
            <View style={styles.rowRight}>
              <Text style={styles.value}>mg/dL</Text>
              <ChevronRightIcon size={18} color={colors.textMuted} strokeWidth={1.8} />
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Target ranges</Text>
            <View style={styles.rowRight}>
              <Text style={styles.value}>IDF defaults</Text>
              <ChevronRightIcon size={18} color={colors.textMuted} strokeWidth={1.8} />
            </View>
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.sectionHeader}>APPEARANCE</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.label}>Dark mode</Text>
            <Switch
              value={appearanceDark}
              onValueChange={setAppearanceDark}
              trackColor={{ false: colors.border, true: colors.accentLight }}
              thumbColor={appearanceDark ? colors.accent : colors.surface}
            />
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.sectionHeader}>DATA</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.label}>Export readings</Text>
            <ChevronRightIcon size={18} color={colors.textMuted} strokeWidth={1.8} />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Clear all data</Text>
            <Text style={styles.valueDanger}>Delete</Text>
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.sectionHeader}>ABOUT</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.label}>Version</Text>
            <Text style={styles.value}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Storage</Text>
            <Text style={styles.value}>On device only</Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>
        YeZZ · diabetes management companion
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
    fontSize: 34,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  group: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
  },
  label: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textPrimary,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  value: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  valueDanger: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.error,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: spacing.xl,
  },
  footer: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textMuted,
    textAlign: "center",
  },
});
