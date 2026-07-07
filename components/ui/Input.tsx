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
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    fontSize: 15,
    color: colors.textPrimary,
  },
});
