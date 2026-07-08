import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { randomUUID } from "expo-crypto";
import { colors, spacing } from "@/theme/tokens";
import { Button } from "@/components/ui/Button";
import { getDbAdapter } from "@/db/instance";
import { createSqliteGlucoseReadings } from "@/features/glucose/GlucoseReadings";
import { useMealLinking } from "@/features/food/hooks/useMealLinking";
import { MealLinkSuggestion } from "@/features/food/components/MealLinkSuggestion";
import { GlucoseValue } from "@/features/glucose/domain/GlucoseValue";
import type { ReadingType, InsertReading } from "@/features/glucose/types";

const readingsRepo = createSqliteGlucoseReadings(getDbAdapter());

const READING_TYPES: { key: ReadingType; label: string }[] = [
  { key: "fasting", label: "Fasting" },
  { key: "pre_meal", label: "Pre-Meal" },
  { key: "post_meal", label: "Post-Meal" },
  { key: "bedtime", label: "Bedtime" },
  { key: "other", label: "Other" },
];

export function AddReadingScreen() {
  const navigation = useNavigation();
  const [type, setType] = useState<ReadingType>("fasting");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<"mg/dL" | "mmol/L">("mg/dL");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const { suggestibleMeals, showDialog, checkForMeals, linkMeal, dismiss } = useMealLinking();
  const valid = GlucoseValue.isValidInput(value, unit);

  const handleSave = async () => {
    if (!valid || saving) return;

    setSaving(true);
    try {
      const numValue = Number(value);
      const readingId = randomUUID();
      const reading: InsertReading = {
        id: readingId,
        value: GlucoseValue.parse(numValue, unit).toMgdl(),
        unit,
        type,
        date,
        time,
        notes: notes || null,
        food_log_id: null,
        workout_session_id: null,
      };

      await readingsRepo.insert(reading);

      if (type === "post_meal") {
        const found = await checkForMeals(date, readingId);
        if (found) return;
      }

      navigation.goBack();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[AddReadingScreen] save failed", err);
      Alert.alert("Error", "Failed to save reading: " + message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reading Type</Text>
        <View style={styles.typeRow}>
          {READING_TYPES.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.typeChip, type === t.key && styles.typeChipSelected]}
              onPress={() => setType(t.key)}
            >
              <Text style={[styles.typeChipText, type === t.key && styles.typeChipTextSelected]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Blood Glucose Value</Text>
        <View style={styles.valueRow}>
          <TextInput
            style={styles.valueInput}
            value={value}
            onChangeText={setValue}
            keyboardType="numeric"
            placeholder="e.g. 128"
            placeholderTextColor={colors.textMuted}
          />
          <TouchableOpacity
            style={styles.unitToggle}
            onPress={() => setUnit(unit === "mg/dL" ? "mmol/L" : "mg/dL")}
          >
            <Text style={styles.unitToggleText}>{unit}</Text>
          </TouchableOpacity>
        </View>
        {value !== "" && !valid && (
          <Text style={styles.validationError}>
            Must be between {GlucoseValue.rangeLabel(unit)} {unit}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Time</Text>
        <TextInput
          style={styles.input}
          value={time}
          onChangeText={setTime}
          placeholder="HH:mm"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional notes"
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={3}
        />
      </View>

      <Button title={saving ? "Saving..." : "Save Reading"} disabled={!valid || saving} onPress={handleSave} />
      <View style={styles.spacer} />
    </ScrollView>

    <Modal visible={showDialog} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {suggestibleMeals.length === 1 ? (
            <MealLinkSuggestion
              mealName={suggestibleMeals[0].food_name}
              estimatedImpact={suggestibleMeals[0].estimated_impact}
              onAccept={async () => {
                await linkMeal(suggestibleMeals[0].id);
                navigation.goBack();
              }}
              onDismiss={() => {
                dismiss();
                navigation.goBack();
              }}
            />
          ) : (
            <View style={styles.pickerCard}>
              <Text style={styles.pickerTitle}>Link to a meal?</Text>
              {suggestibleMeals.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  style={styles.pickerRow}
                  onPress={async () => {
                    await linkMeal(meal.id);
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.pickerMealName}>{meal.food_name}</Text>
                  <Text style={styles.pickerImpact}>
                    Est. +{Math.round(meal.estimated_impact)} mg/dL
                  </Text>
                </TouchableOpacity>
              ))}
              <Button title="Skip" variant="ghost" onPress={() => { dismiss(); navigation.goBack(); }} />
            </View>
          )}
        </View>
      </View>
    </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.xxl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
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
  valueRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  valueInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  unitToggle: {
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  unitToggleText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.accent,
  },
  validationError: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.error,
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
  spacer: {
    height: spacing.xxl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: spacing.xl,
  },
  modalContainer: {
    gap: spacing.md,
  },
  pickerCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  pickerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerMealName: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  pickerImpact: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.info,
  },
});