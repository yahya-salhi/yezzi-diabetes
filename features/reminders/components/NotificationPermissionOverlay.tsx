import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";
import { colors, spacing } from "@/theme/tokens";

type Props = {
  onGranted: () => void;
  onDismiss: () => void;
};

export function NotificationPermissionOverlay({ onGranted, onDismiss }: Props) {
  const [requesting, setRequesting] = useState(false);

  const handleGrant = async () => {
    setRequesting(true);
    try {
      const result = await Notifications.requestPermissionsAsync();
      if (result.granted) {
        onGranted();
      } else {
        onDismiss();
      }
    } catch {
      onDismiss();
    } finally {
      setRequesting(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>🔔</Text>
        </View>
        <Text style={styles.title}>Stay on track</Text>
        <Text style={styles.message}>
          YeZZ can send you a quick nudge when it is time for your reading. No spam, just helpful reminders.
        </Text>
        <TouchableOpacity
          style={[styles.button, requesting && styles.buttonDisabled]}
          onPress={handleGrant}
          disabled={requesting}
        >
          <Text style={styles.buttonText}>{requesting ? "Requesting..." : "Grant Access"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDismiss} disabled={requesting}>
          <Text style={styles.skip}>Not now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxxl,
    zIndex: 100,
  },
  content: {
    alignItems: "center",
    gap: spacing.lg,
    maxWidth: 320,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.md,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  skip: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
});
