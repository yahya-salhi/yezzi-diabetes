import { type ComponentProps, forwardRef } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/tokens";

type Props = ComponentProps<typeof TouchableOpacity> & {
  title: string;
  variant?: "primary" | "secondary";
};

export const Button = forwardRef<any, Props>(
  ({ title, variant = "primary", style, ...props }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        style={[
          styles.base,
          variant === "primary" ? styles.primary : styles.secondary,
          style,
        ]}
        {...props}
      >
        <Text
          style={[
            styles.text,
            variant === "primary" ? styles.primaryText : styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
  primaryText: {
    color: colors.surface,
  },
  secondaryText: {
    color: colors.textPrimary,
  },
});
