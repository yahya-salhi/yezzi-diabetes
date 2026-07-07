import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { randomUUID } from "expo-crypto";
import { colors, spacing } from "@/theme/tokens";
import { Button } from "@/components/ui/Button";
import type { ReadingType, InsertReading } from "@/features/glucose/types";
import { insertReading } from "@/features/glucose/services/readings";

const READING_TYPES: { key: ReadingType; label: string }[] = [
  { key: "fasting", label: "Fasting" },
  { key: "pre_meal", label: "Pre-Meal" },
  { key: "post_meal", label: "Post-Meal" },
  { key: "bedtime", label: "Bedtime" },
  { key: "other", label: "Other" },
];

const MIN_MGDL = 20;
const MAX_MGDL = 600;

function toMmol(value: number): number {
  return value / 18.0182;
}

function isValueValid(value: string, unit: "mg/dL" | "mmol/L"): boolean {
  const num = Number(value);
  if (isNaN(num) || num <= 0) return false;
  if (unit === "mg/dL") return num >= MIN_MGDL && num <= MAX_MGDL;
  return num >= toMmol(MIN_MGDL) && num <= toMmol(MAX_MGDL);
}

function toInternalMgdl(value: number, unit: "mg/dL" | "mmol/L"): number {
  if (unit === "mg/dL") return value;
  return value * 18.0182;
}

export function AddReadingScreen() {
  const navigation = useNavigation();
  const [type, setType] = useState<ReadingType>("fasting");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState<"mg/dL" | "mmol/L">("mg/dL");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const valid = isValueValid(value, unit);

  const handleSave = async () => {
    if (!valid || saving) return;

    setSaving(true);
    try {
      const numValue = Number(value);
      const reading: InsertReading = {
        id: randomUUID(),
        value: toInternalMgdl(numValue, unit),
        unit,
        type,
        date,
        time,
        notes: notes || null,
        food_log_id: null,
        workout_session_id: null,
      };

      await insertReading(reading);
      navigation.goBack();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[AddReadingScreen] save failed", err);
      Alert.alert("Error", `Failed to save reading: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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

      <Text style={styles.sectionTitle}>Value</Text>
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
          Value must be between {unit === "mg/dL" ? `${MIN_MGDL}-${MAX_MGDL}` : `${toMmol(MIN_MGDL).toFixed(1)}-${toMmol(MAX_MGDL).toFixed(1)}`} {unit}
        </Text>
      )}

      <Text style={styles.sectionTitle}>Date</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={colors.textMuted}
      />

      <Text style={styles.sectionTitle}>Time</Text>
      <TextInput
        style={styles.input}
        value={time}
        onChangeText={setTime}
        placeholder="HH:mm"
        placeholderTextColor={colors.textMuted}
      />

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

      <View style={styles.actions}>
        <Button title={saving ? "Saving..." : "Save"} disabled={!valid || saving} onPress={handleSave} />
        <Button title="Cancel" variant="secondary" onPress={() => navigation.goBack()} />
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
    padding: spacing.lg,
    gap: spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  typeChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  typeChipSelected: {
    borderColor: colors.accent,
    backgroundColor: "#F0EDFF",
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  typeChipTextSelected: {
    color: colors.accent,
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
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  unitToggle: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  unitToggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.accent,
  },
  validationError: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.error,
  },
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
  textarea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
});
