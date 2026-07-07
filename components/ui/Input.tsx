import { TextInput, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/tokens";

type Props = React.ComponentProps<typeof TextInput>;

export function Input(props: Props) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor={colors.textMuted}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
