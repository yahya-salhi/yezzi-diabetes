import { ScrollView, View, Text, Switch, TouchableOpacity, Platform, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, spacing } from "@/theme/tokens";
import { ChevronRightIcon } from "@/components/ui/Icons";
import { useReminderSettings } from "@/features/reminders/hooks/useReminderSettings";
import { NotificationPermissionOverlay } from "@/features/reminders/components/NotificationPermissionOverlay";
import { BackupReminderCard } from "@/features/settings/components/BackupReminderCard";
import { createBackup, saveBackupFile, updateLastBackupTimestamp } from "@/features/settings/services/backup";
import { pickBackupFile, validateBackup, applyBackup } from "@/features/settings/services/restore";
import type { ReminderType } from "@/features/reminders/types";
import * as Notifications from "expo-notifications";

const REMINDER_LABELS: Record<string, string> = {
  fasting: "Fasting",
  pre_meal: "Pre-Meal",
  post_meal: "Post-Meal",
  bedtime: "Bedtime",
  other: "Other",
  weekly_summary: "Weekly Summary",
};

export function SettingsScreen() {
  const [appearanceDark, setAppearanceDark] = useState(false);
  const { preferences, save, loading } = useReminderSettings();
  const [pickerTarget, setPickerTarget] = useState<string | null>(null);
  const [pickerDate, setPickerDate] = useState(new Date());
  const [pendingToggle, setPendingToggle] = useState<string | null>(null);
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const handleToggle = async (id: string, enabled: boolean) => {
    if (!enabled) {
      await save({ id, enabled });
      return;
    }
    const { granted } = await Notifications.getPermissionsAsync();
    if (granted) {
      await save({ id, enabled });
    } else {
      setPendingToggle(id);
    }
  };

  const handlePermissionGranted = async () => {
    if (pendingToggle) {
      await save({ id: pendingToggle, enabled: true });
      setPendingToggle(null);
    }
  };

  const handlePermissionDismissed = () => {
    setPendingToggle(null);
  };

  const handleTimePress = (pref: { id: string; hour: number | null; minute: number | null }) => {
    const d = new Date();
    d.setHours(pref.hour ?? 7, pref.minute ?? 0, 0, 0);
    setPickerDate(d);
    setPickerTarget(pref.id);
  };

  const handleTimeChange = async (_: any, date?: Date) => {
    if (Platform.OS === "android") {
      setPickerTarget(null);
    }
    if (date) {
      setPickerDate(date);
      if (Platform.OS === "android") {
        await save({ id: pickerTarget!, hour: date.getHours(), minute: date.getMinutes() });
      }
    }
  };

  const handleIosDone = async () => {
    if (pickerTarget) {
      await save({ id: pickerTarget, hour: pickerDate.getHours(), minute: pickerDate.getMinutes() });
    }
    setPickerTarget(null);
  };

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      const backup = await createBackup();
      await saveBackupFile(backup);
      await updateLastBackupTimestamp();
    } catch (err: any) {
      Alert.alert("Backup failed", err?.message ?? "Something went wrong.");
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestore = async () => {
    Alert.alert(
      "Restore from backup",
      "This will replace all current data with the backup. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          style: "destructive",
          onPress: async () => {
            setRestoreLoading(true);
            try {
              const backup = await pickBackupFile();
              if (!backup) {
                setRestoreLoading(false);
                return;
              }
              const error = validateBackup(backup);
              if (error) {
                Alert.alert("Invalid backup", error);
                setRestoreLoading(false);
                return;
              }
              await applyBackup(backup);
              Alert.alert("Restore complete", "Your data has been restored.");
            } catch (err: any) {
              Alert.alert("Restore failed", err?.message ?? "Something went wrong.");
            } finally {
              setRestoreLoading(false);
            }
          },
        },
      ],
    );
  };

  function formatTime(hour: number | null, minute: number | null): string {
    if (hour == null || minute == null) return "--:--";
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }

  return (
    <View style={styles.root}>
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
        <Text style={styles.sectionHeader}>REMINDERS</Text>
        <View style={styles.group}>
          {preferences.map((pref, idx) => (
            <View key={pref.id}>
              {idx > 0 && <View style={styles.divider} />}
              <View style={styles.row}>
                <Text style={styles.label}>{REMINDER_LABELS[pref.reminderType]}</Text>
                <View style={styles.rowRight}>
                  {pref.reminderType !== "weekly_summary" && (
                    <TouchableOpacity
                      onPress={() => handleTimePress(pref)}
                      disabled={!pref.enabled}
                      style={styles.timeButton}
                    >
                      <Text
                        style={[
                          styles.timeText,
                          !pref.enabled && styles.timeTextDisabled,
                        ]}
                      >
                        {formatTime(pref.hour, pref.minute)}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <Switch
                    value={pref.enabled}
                    onValueChange={(val) => handleToggle(pref.id, val)}
                    trackColor={{ false: colors.border, true: colors.accentLight }}
                    thumbColor={pref.enabled ? colors.accent : colors.surface}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {pickerTarget && Platform.OS === "ios" && (
        <View style={styles.pickerWrapper}>
          <TouchableOpacity style={styles.doneButton} onPress={handleIosDone}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
          <DateTimePicker
            value={pickerDate}
            mode="time"
            is24Hour={true}
            onChange={handleTimeChange}
          />
        </View>
      )}

      {pickerTarget && Platform.OS === "android" && (
        <DateTimePicker
          value={pickerDate}
          mode="time"
          is24Hour={true}
          onChange={handleTimeChange}
        />
      )}

      <View>
        <Text style={styles.sectionHeader}>DATA</Text>
        <BackupReminderCard onBackupMade={handleBackup} />
        <View style={styles.group}>
          <TouchableOpacity style={styles.row} onPress={handleBackup} disabled={backupLoading}>
            <Text style={styles.label}>Back up my data</Text>
            {backupLoading ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <ChevronRightIcon size={18} color={colors.textMuted} strokeWidth={1.8} />
            )}
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={handleRestore} disabled={restoreLoading}>
            <Text style={styles.label}>Restore from backup</Text>
            {restoreLoading ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <ChevronRightIcon size={18} color={colors.textMuted} strokeWidth={1.8} />
            )}
          </TouchableOpacity>
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
      {pendingToggle && (
        <NotificationPermissionOverlay
          onGranted={handlePermissionGranted}
          onDismiss={handlePermissionDismissed}
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
  timeButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  timeText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.accent,
  },
  timeTextDisabled: {
    color: colors.textMuted,
  },
  pickerWrapper: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: "hidden",
  },
  doneButton: {
    alignItems: "flex-end",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  doneText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.accent,
  },
});
