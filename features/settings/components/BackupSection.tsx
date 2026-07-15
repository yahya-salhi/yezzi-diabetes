import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";
import { colors, spacing } from "@/theme/tokens";
import { ChevronRightIcon } from "@/components/ui/Icons";
import { BackupReminderCard } from "@/features/settings/components/BackupReminderCard";
import { createBackup, writeBackup, shareBackup, updateLastBackupTimestamp } from "@/features/settings/services/backup";
import { pickBackupFile, validateBackup, applyBackup } from "@/features/settings/services/restore";

export function BackupSection() {
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      const backup = await createBackup();
      const uri = writeBackup(backup);
      await shareBackup(uri);
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

  return (
    <View>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: spacing.xl,
  },
});
