import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/tokens";
import { Button } from "./Button";

type Props = {
  icon?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <Button title={actionLabel} variant="secondary" onPress={onAction} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
    gap: spacing.lg,
  },
  message: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textMuted,
    textAlign: "center",
  },
});
