import { type ComponentProps, forwardRef } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "@/theme/tokens";

type Props = ComponentProps<typeof TouchableOpacity> & {
  title: string;
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = forwardRef<any, Props>(
  ({ title, variant = "primary", style, ...props }, ref) => {
    return (
      <TouchableOpacity
        ref={ref}
        style={[
          styles.base,
          variant === "primary" && styles.primary,
          variant === "secondary" && styles.secondary,
          variant === "ghost" && styles.ghost,
          style,
        ]}
        {...props}
      >
        <Text
          style={[
            styles.text,
            variant === "primary" && styles.primaryText,
            variant === "secondary" && styles.secondaryText,
            variant === "ghost" && styles.ghostText,
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
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  text: {
    ...typography.buttonLabel,
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: colors.textPrimary,
  },
  ghostText: {
    color: colors.accent,
  },
});
