import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { colors, spacing } from "@/theme/tokens";
import { Button } from "@/components/ui/Button";
import { usePreferences } from "@/features/onboarding/hooks/usePreferences";

type Props = {
  onComplete: () => void;
};

const IDF_DEFAULTS = {
  fasting_low: 70,
  fasting_high: 100,
  postmeal_low: 70,
  postmeal_high: 140,
};

export function OnboardingScreen({ onComplete }: Props) {
  const { save } = usePreferences();
  const [step, setStep] = useState(0);
  const [unit, setUnit] = useState<"mg/dL" | "mmol/L">("mg/dL");
  const [fastingLow, setFastingLow] = useState(String(IDF_DEFAULTS.fasting_low));
  const [fastingHigh, setFastingHigh] = useState(String(IDF_DEFAULTS.fasting_high));
  const [postmealLow, setPostmealLow] = useState(String(IDF_DEFAULTS.postmeal_low));
  const [postmealHigh, setPostmealHigh] = useState(String(IDF_DEFAULTS.postmeal_high));
  const [saving, setSaving] = useState(false);

  const handleFinish = async (skipTargets: boolean) => {
    setSaving(true);
    try {
      await save({
        unit,
        ...(skipTargets
          ? {}
          : {
              fasting_target_low: Number(fastingLow),
              fasting_target_high: Number(fastingHigh),
              postmeal_target_low: Number(postmealLow),
              postmeal_target_high: Number(postmealHigh),
            }),
      });
      onComplete();
    } catch {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.appName}>YeZZ</Text>

      {step === 0 && (
        <View style={styles.step}>
          <Text style={styles.title}>Choose your unit</Text>
          <Text style={styles.subtitle}>
            All readings will be displayed in this unit.
          </Text>
          <View style={styles.unitRow}>
            <TouchableOpacity
              style={[styles.unitOption, unit === "mg/dL" && styles.unitSelected]}
              onPress={() => setUnit("mg/dL")}
            >
              <Text style={[styles.unitText, unit === "mg/dL" && styles.unitTextSelected]}>mg/dL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitOption, unit === "mmol/L" && styles.unitSelected]}
              onPress={() => setUnit("mmol/L")}
            >
              <Text style={[styles.unitText, unit === "mmol/L" && styles.unitTextSelected]}>mmol/L</Text>
            </TouchableOpacity>
          </View>
          <Button title="Continue" onPress={() => setStep(1)} />
        </View>
      )}

      {step === 1 && (
        <View style={styles.step}>
          <Text style={styles.title}>Set your target ranges</Text>
          <Text style={styles.subtitle}>
            Optional. Pre-filled with IDF-recommended ranges.
          </Text>

          <Text style={styles.fieldLabel}>Fasting — Low (mg/dL)</Text>
          <TextInput
            style={styles.input}
            value={fastingLow}
            onChangeText={setFastingLow}
            keyboardType="numeric"
          />
          <Text style={styles.fieldLabel}>Fasting — High (mg/dL)</Text>
          <TextInput
            style={styles.input}
            value={fastingHigh}
            onChangeText={setFastingHigh}
            keyboardType="numeric"
          />
          <Text style={styles.fieldLabel}>Post-meal — Low (mg/dL)</Text>
          <TextInput
            style={styles.input}
            value={postmealLow}
            onChangeText={setPostmealLow}
            keyboardType="numeric"
          />
          <Text style={styles.fieldLabel}>Post-meal — High (mg/dL)</Text>
          <TextInput
            style={styles.input}
            value={postmealHigh}
            onChangeText={setPostmealHigh}
            keyboardType="numeric"
          />

          <Button
            title={saving ? "Saving..." : "Get Started"}
            onPress={() => handleFinish(false)}
            disabled={saving}
          />
          <TouchableOpacity onPress={() => handleFinish(true)} disabled={saving}>
            <Text style={styles.skip}>Skip — use defaults</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xxl,
    justifyContent: "center",
    flexGrow: 1,
  },
  appName: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.accent,
    textAlign: "center",
    marginBottom: spacing.xxl,
  },
  step: {
    gap: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textSecondary,
    textAlign: "center",
  },
  unitRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  unitOption: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  unitSelected: {
    borderColor: colors.accent,
    backgroundColor: "#F0EDFF",
  },
  unitText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  unitTextSelected: {
    color: colors.accent,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
    marginTop: spacing.sm,
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
  skip: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textMuted,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
