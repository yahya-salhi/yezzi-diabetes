import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { colors, spacing } from "@/theme/tokens";
import { Button } from "@/components/ui/Button";
import { NutritionBreakdown } from "@/features/food/components/NutritionBreakdown";
import { EstimatedImpactBadge } from "@/features/food/components/EstimatedImpactBadge";
import type { MealType } from "@/features/food/types";

const MEAL_TYPES: { key: MealType; label: string }[] = [
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
  { key: "snack", label: "Snack" },
];

type Props = {
  photoUri?: string | null;
  foodName: string;
  onFoodNameChange: (v: string) => void;
  calories: string;
  carbsG: string;
  proteinG: string;
  fatG: string;
  onCaloriesChange: (v: string) => void;
  onCarbsChange: (v: string) => void;
  onProteinChange: (v: string) => void;
  onFatChange: (v: string) => void;
  estimatedImpact: number;
  mealType: MealType;
  onMealTypeChange: (v: MealType) => void;
  notes: string;
  onNotesChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
  saveError?: string | null;
};

export function MealReviewForm({
  photoUri,
  foodName,
  onFoodNameChange,
  calories,
  carbsG,
  proteinG,
  fatG,
  onCaloriesChange,
  onCarbsChange,
  onProteinChange,
  onFatChange,
  estimatedImpact,
  mealType,
  onMealTypeChange,
  notes,
  onNotesChange,
  onSave,
  onCancel,
  saving,
  saveError,
}: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {photoUri && (
        <Image source={{ uri: photoUri }} style={styles.photo} />
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Food Name</Text>
        <TextInput
          style={styles.input}
          value={foodName}
          onChangeText={onFoodNameChange}
          placeholder="e.g. Grilled Chicken Salad"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <NutritionBreakdown
        calories={calories}
        carbsG={carbsG}
        proteinG={proteinG}
        fatG={fatG}
        onCaloriesChange={onCaloriesChange}
        onCarbsChange={onCarbsChange}
        onProteinChange={onProteinChange}
        onFatChange={onFatChange}
      />

      <EstimatedImpactBadge impact={estimatedImpact} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meal Type</Text>
        <View style={styles.typeRow}>
          {MEAL_TYPES.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.typeChip, mealType === t.key && styles.typeChipSelected]}
              onPress={() => onMealTypeChange(t.key)}
            >
              <Text style={[styles.typeChipText, mealType === t.key && styles.typeChipTextSelected]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={notes}
          onChangeText={onNotesChange}
          placeholder="Optional notes about this meal"
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={3}
        />
      </View>

      {saveError && (
        <Text style={styles.saveError}>{saveError}</Text>
      )}

      <View style={styles.actions}>
        <Button title="Save Meal" onPress={onSave} disabled={saving} />
        <Button title="Cancel" variant="secondary" onPress={onCancel} disabled={saving} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  photo: {
    width: "100%",
    height: 240,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
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
  textarea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  typeChip: {
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  typeChipSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentLight,
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  typeChipTextSelected: {
    color: colors.accent,
    fontWeight: "600",
  },
  saveError: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.error,
    textAlign: "center",
  },
  actions: {
    gap: spacing.md,
    paddingTop: spacing.md,
  },
});
