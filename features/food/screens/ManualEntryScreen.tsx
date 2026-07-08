import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { FoodStackParamList } from "@/navigation/types";
import { colors, spacing } from "@/theme/tokens";
import { MealReviewForm } from "@/features/food/components/MealReviewForm";
import { useMealAnalysis } from "@/features/food/hooks/useMealAnalysis";
import { useFoodLog } from "@/features/food/hooks/useFoodLog";
import type { MealType } from "@/features/food/types";

type Step = "input" | "loading" | "review";

export function ManualEntryScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<FoodStackParamList, "ManualEntry">>();
  const { analyzing, needsKey, analyzeText, provideApiKey, dismissKeyPrompt } = useMealAnalysis();
  const { saving, error: saveError, saveMeal } = useFoodLog();

  const [step, setStep] = useState<Step>("input");
  const [description, setDescription] = useState("");
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [carbsG, setCarbsG] = useState("");
  const [proteinG, setProteinG] = useState("");
  const [fatG, setFatG] = useState("");
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [notes, setNotes] = useState("");
  const [estimatedImpact, setEstimatedImpact] = useState(0);
  const [keyInput, setKeyInput] = useState("");

  const handleAnalyze = async () => {
    if (!description.trim()) return;

    setStep("loading");
    const result = await analyzeText(description.trim());

    if (result) {
      setFoodName(result.food_name);
      setCalories(String(result.calories));
      setCarbsG(String(result.carbs_g));
      setProteinG(result.protein_g !== null ? String(result.protein_g) : "");
      setFatG(result.fat_g !== null ? String(result.fat_g) : "");
      setEstimatedImpact(result.estimated_impact_mgdl);
      setStep("review");
    } else {
      setStep("input");
    }
  };

  const handleSave = async () => {
    try {
      await saveMeal({
        meal_type: mealType,
        food_name: foodName,
        calories: Number(calories) || 0,
        carbs_g: Number(carbsG) || 0,
        protein_g: proteinG ? Number(proteinG) : null,
        fat_g: fatG ? Number(fatG) : null,
        estimated_impact: estimatedImpact,
        photo_uri: route.params?.photoUri ?? null,
        notes: notes || null,
      });
      navigation.goBack();
    } catch {
      // saveError is set by the hook
    }
  };

  if (step === "loading" || analyzing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Analyzing your meal description...</Text>
      </View>
    );
  }

  if (step === "review") {
    return (
      <MealReviewForm
        photoUri={route.params?.photoUri}
        foodName={foodName}
        onFoodNameChange={setFoodName}
        calories={calories}
        carbsG={carbsG}
        proteinG={proteinG}
        fatG={fatG}
        onCaloriesChange={setCalories}
        onCarbsChange={setCarbsG}
        onProteinChange={setProteinG}
        onFatChange={setFatG}
        estimatedImpact={estimatedImpact}
        mealType={mealType}
        onMealTypeChange={setMealType}
        notes={notes}
        onNotesChange={setNotes}
        onSave={handleSave}
        onCancel={() => navigation.goBack()}
        saving={saving}
        saveError={saveError}
      />
    );
  }

  const handleProvideKey = async () => {
    if (!keyInput.trim()) return;
    await provideApiKey(keyInput.trim());
    setKeyInput("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Describe Your Meal</Text>
        <Text style={styles.subtitle}>
          Type what you ate and we'll estimate the nutrition.
        </Text>
        <TextInput
          style={styles.textarea}
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. A bowl of chicken noodle soup with a side salad and vinaigrette dressing"
          placeholderTextColor={colors.textMuted}
          multiline
          textAlignVertical="top"
          autoFocus
        />
        <TouchableOpacity
          style={[styles.analyzeButton, !description.trim() && styles.analyzeButtonDisabled]}
          onPress={handleAnalyze}
          disabled={!description.trim()}
        >
          <Text style={styles.analyzeButtonText}>Analyze Meal</Text>
        </TouchableOpacity>
      </View>

      {needsKey && (
        <View style={styles.overlay}>
          <View style={styles.keyModal}>
            <Text style={styles.keyTitle}>OpenAI API Key Required</Text>
            <Text style={styles.keyMessage}>
              Enter your OpenAI API key to analyze meals. Your key is stored securely on your device.
            </Text>
            <TextInput
              style={styles.keyInput}
              value={keyInput}
              onChangeText={setKeyInput}
              placeholder="sk-..."
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />
            <View style={styles.keyActions}>
              <TouchableOpacity style={styles.keyButton} onPress={handleProvideKey}>
                <Text style={styles.keyButtonText}>Save & Continue</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { dismissKeyPrompt(); navigation.goBack(); }}>
                <Text style={styles.keyCancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.xl,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 22,
  },
  textarea: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.xl,
    fontSize: 15,
    color: colors.textPrimary,
    minHeight: 140,
    lineHeight: 22,
  },
  analyzeButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  analyzeButtonDisabled: {
    opacity: 0.5,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxxl,
  },
  keyModal: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xxl,
    width: "100%",
    gap: spacing.lg,
  },
  keyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
  },
  keyMessage: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  keyInput: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    fontSize: 15,
    color: colors.textPrimary,
  },
  keyActions: {
    gap: spacing.md,
    alignItems: "center",
  },
  keyButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: spacing.xxl,
    width: "100%",
    alignItems: "center",
  },
  keyButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  keyCancel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textMuted,
  },
});
