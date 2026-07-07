import type { PropsWithChildren } from "react";
import { View, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/tokens";

type Props = PropsWithChildren<{
  style?: Record<string, any>;
}>;

export function Card({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.xl,
  },
});
