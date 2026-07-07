import type { PropsWithChildren } from "react";
import { View, StyleSheet } from "react-native";
import { colors, spacing, shadows } from "@/theme/tokens";

type Props = PropsWithChildren<{
  style?: Record<string, any>;
}>;

export function Card({ children, style }: Props) {
  return <View style={[styles.card, shadows.md, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.xl,
  },
});
