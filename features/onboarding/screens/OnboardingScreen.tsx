import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/tokens";
import { Button } from "@/components/ui/Button";
import { usePreferences } from "@/features/onboarding/hooks/usePreferences";
import { createSqliteReminderStorage } from "@/features/reminders/services/reminderStorage";
import { createNotificationScheduler } from "@/features/reminders/services/notificationScheduler";
import { NotificationPermissionOverlay } from "@/features/reminders/components/NotificationPermissionOverlay";
import { useGlucoseReadings } from "@/features/repos/RepoContext";
import * as Notifications from "expo-notifications";

type Props = {
  onComplete: () => void;
};

const IDF_DEFAULTS = {
  fasting_low: 70,
  fasting_high: 100,
  postmeal_low: 70,
  postmeal_high: 140,
};

export function OnboardingScreen({ onComplete }: Props) {
  const { save } = usePreferences();
  const glucoseReadings = useGlucoseReadings();
  const [step, setStep] = useState(0);
  const [unit, setUnit] = useState<"mg/dL" | "mmol/L">("mg/dL");
  const [fastingLow, setFastingLow] = useState(String(IDF_DEFAULTS.fasting_low));
  const [fastingHigh, setFastingHigh] = useState(String(IDF_DEFAULTS.fasting_high));
  const [postmealLow, setPostmealLow] = useState(String(IDF_DEFAULTS.postmeal_low));
  const [postmealHigh, setPostmealHigh] = useState(String(IDF_DEFAULTS.postmeal_high));
  const [saving, setSaving] = useState(false);
  const [showPermissionOverlay, setShowPermissionOverlay] = useState(false);

  const finishWithReminder = async () => {
    const storage = createSqliteReminderStorage();
    await storage.save({ id: "fasting", enabled: true, hour: 7, minute: 0 });
    const all = await storage.getAll();
    const scheduler = createNotificationScheduler(glucoseReadings);
    await scheduler.scheduleAll(all);
    onComplete();
  };

  const handleReminderChoice = async (enable: boolean) => {
    if (!enable) {
      onComplete();
      return;
    }
    const { granted } = await Notifications.getPermissionsAsync();
    if (granted) {
      await finishWithReminder();
    } else {
      setShowPermissionOverlay(true);
    }
  };

  const handleFinishTargets = async (skipTargets: boolean) => {
    setSaving(true);
    try {
      await save({
        unit,
        ...(skipTargets
          ? {}
          : {
              fasting_target_low: Number(fastingLow),
              fasting_target_high: Number(fastingHigh),
              postmeal_target_low: Number(postmealLow),
              postmeal_target_high: Number(postmealHigh),
            }),
      });
      setStep(2);
    } catch {
      setSaving(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {step === 0 && (
        <View style={styles.step}>
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>Y</Text>
            </View>
            <Text style={styles.appName}>YeZZ</Text>
            <Text style={styles.tagline}>Your diabetes companion</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Choose your unit</Text>
            <Text style={styles.subtitle}>
              All readings will be displayed in this unit.
            </Text>
            <View style={styles.unitRow}>
              <TouchableOpacity
                style={[styles.unitOption, unit === "mg/dL" && styles.unitSelected]}
                onPress={() => setUnit("mg/dL")}
              >
                <Text style={[styles.unitValue, unit === "mg/dL" && styles.unitValueSelected]}>mg/dL</Text>
                <Text style={styles.unitDesc}>Standard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitOption, unit === "mmol/L" && styles.unitSelected]}
                onPress={() => setUnit("mmol/L")}
              >
                <Text style={[styles.unitValue, unit === "mmol/L" && styles.unitValueSelected]}>mmol/L</Text>
                <Text style={styles.unitDesc}>International</Text>
              </TouchableOpacity>
            </View>
            <Button title="Continue" onPress={() => setStep(1)} />
          </View>
        </View>
      )}

      {step === 1 && (
        <View style={styles.step}>
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>Y</Text>
            </View>
            <Text style={styles.appName}>YeZZ</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Set target ranges</Text>
            <Text style={styles.subtitle}>
              Pre-filled with IDF-recommended ranges. You can adjust these later.
            </Text>

            <Text style={styles.fieldLabel}>Fasting — Low (mg/dL)</Text>
            <TextInput
              style={styles.input}
              value={fastingLow}
              onChangeText={setFastingLow}
              keyboardType="numeric"
            />
            <Text style={styles.fieldLabel}>Fasting — High (mg/dL)</Text>
            <TextInput
              style={styles.input}
              value={fastingHigh}
              onChangeText={setFastingHigh}
              keyboardType="numeric"
            />
            <Text style={styles.fieldLabel}>Post-meal — Low (mg/dL)</Text>
            <TextInput
              style={styles.input}
              value={postmealLow}
              onChangeText={setPostmealLow}
              keyboardType="numeric"
            />
            <Text style={styles.fieldLabel}>Post-meal — High (mg/dL)</Text>
            <TextInput
              style={styles.input}
              value={postmealHigh}
              onChangeText={setPostmealHigh}
              keyboardType="numeric"
            />

            <View style={styles.targetActions}>
              <Button
                title={saving ? "Saving..." : "Get Started"}
                onPress={() => handleFinishTargets(false)}
                disabled={saving}
              />
              <TouchableOpacity onPress={() => handleFinishTargets(true)} disabled={saving}>
                <Text style={styles.skip}>Skip — use defaults</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {step === 2 && (
        <View style={styles.step}>
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>Y</Text>
            </View>
            <Text style={styles.appName}>YeZZ</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Morning reminder</Text>
            <Text style={styles.subtitle}>
              Want a nudge for your morning reading? We will remind you every day at 07:00.
            </Text>
            <Text style={styles.reminderNote}>
              You can change the time or add more reminders later in Settings.
            </Text>

            <View style={styles.targetActions}>
              <Button title="Yes, remind me at 07:00" onPress={() => handleReminderChoice(true)} />
              <TouchableOpacity onPress={() => handleReminderChoice(false)}>
                <Text style={styles.skip}>No, skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
      {showPermissionOverlay && (
        <NotificationPermissionOverlay
          onGranted={finishWithReminder}
          onDismiss={onComplete}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xxl,
    justifyContent: "center",
    flexGrow: 1,
    gap: spacing.xxxl,
  },
  step: {
    gap: spacing.xxxl,
  },
  logoArea: {
    alignItems: "center",
    gap: spacing.md,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.textMuted,
    marginTop: -spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 22,
  },
  unitRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  unitOption: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  unitSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentLight,
  },
  unitValue: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  unitValueSelected: {
    color: colors.accent,
  },
  unitDesc: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.textMuted,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    fontSize: 15,
    color: colors.textPrimary,
  },
  targetActions: {
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  skip: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textMuted,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  reminderNote: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textMuted,
    lineHeight: 18,
  },
});
