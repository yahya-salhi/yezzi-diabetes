import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/tokens";

type Props = {
  calories: string;
  carbsG: string;
  proteinG: string;
  fatG: string;
  onCaloriesChange: (v: string) => void;
  onCarbsChange: (v: string) => void;
  onProteinChange: (v: string) => void;
  onFatChange: (v: string) => void;
};

export function NutritionBreakdown({
  calories,
  carbsG,
  proteinG,
  fatG,
  onCaloriesChange,
  onCarbsChange,
  onProteinChange,
  onFatChange,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition Breakdown</Text>
      <View style={styles.grid}>
        <View style={styles.field}>
          <Text style={styles.label}>Calories</Text>
          <TextInput
            style={styles.input}
            value={calories}
            onChangeText={onCaloriesChange}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Carbs (g)</Text>
          <TextInput
            style={styles.input}
            value={carbsG}
            onChangeText={onCarbsChange}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Protein (g)</Text>
          <TextInput
            style={styles.input}
            value={proteinG}
            onChangeText={onProteinChange}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Fat (g)</Text>
          <TextInput
            style={styles.input}
            value={fatG}
            onChangeText={onFatChange}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  field: {
    width: "47%",
    gap: spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
