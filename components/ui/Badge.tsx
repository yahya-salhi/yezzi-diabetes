import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/theme/tokens";

type Props = {
  label: string;
  color?: string;
  backgroundColor?: string;
};

export function Badge({
  label,
  color = colors.textPrimary,
  backgroundColor = colors.surfaceSecondary,
}: Props) {
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 13,
    fontWeight: "500",
  },
});
