import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { needsBackup } from "@/features/settings/services/backup";
import { colors, spacing } from "@/theme/tokens";

type Props = {
  onBackupMade?: () => void;
};

export function BackupReminderCard({ onBackupMade }: Props) {
  const [visible, setVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const check = async () => {
        try {
          const show = await needsBackup();
          if (!cancelled) setVisible(show);
        } catch {
          if (!cancelled) setVisible(false);
        }
      };

      check();
      return () => { cancelled = true; };
    }, []),
  );

  if (!visible) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Back up your data</Text>
      <Text style={styles.body}>
        You have over 30 days of readings. Consider backing up so you never lose your history.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setVisible(false);
          onBackupMade?.();
        }}
      >
        <Text style={styles.buttonText}>Back up now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.accentLight,
    borderRadius: 14,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.accent,
  },
  body: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 20,
  },
  button: {
    marginTop: spacing.sm,
    alignSelf: "flex-start",
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
