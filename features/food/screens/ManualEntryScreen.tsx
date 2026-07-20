import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { FoodStackParamList } from "@/navigation/types";
import { colors, spacing } from "@/theme/tokens";
import { MealReviewForm } from "@/features/food/components/MealReviewForm";
import { useMealAnalysis } from "@/features/food/hooks/useMealAnalysis";
import { useFoodLog } from "@/features/food/hooks/useFoodLog";
import { useQuota } from "@/features/food/hooks/useQuota";
import type { MealType } from "@/features/food/types";

type Step = "input" | "loading" | "review";

export function ManualEntryScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<FoodStackParamList, "ManualEntry">>();
  const { analyzing, error: analysisError, analyzeText } = useMealAnalysis();
  const { saving, error: saveError, saveMeal } = useFoodLog();
  const { quota } = useQuota();

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

  const quotaRemaining = quota?.remaining ?? null;
  const isQuotaExhausted = quotaRemaining !== null && quotaRemaining <= 0;

  const handleAnalyze = async () => {
    if (!description.trim() || isQuotaExhausted) return;

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

  const handleSkipAI = () => {
    setFoodName("");
    setCalories("");
    setCarbsG("");
    setProteinG("");
    setFatG("");
    setEstimatedImpact(0);
    setStep("review");
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
        onCancel={() => setStep("input")}
        saving={saving}
        saveError={saveError}
      />
    );
  }

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

        {quotaRemaining !== null && (
          <Text style={styles.quotaText}>
            {isQuotaExhausted
              ? "No AI scans remaining this month"
              : `${quotaRemaining} AI scan${quotaRemaining === 1 ? "" : "s"} remaining`}
          </Text>
        )}

        {analysisError?.type === "quota_exhausted" && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>
              You've used all 10 scans this month. Enter manually or try next month.
            </Text>
          </View>
        )}

        {analysisError?.type === "ai_service_error" && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>Analysis failed. Please try again.</Text>
          </View>
        )}

        {analysisError?.type === "proxy_unavailable" && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>Service unavailable. Please try again.</Text>
          </View>
        )}

        {analysisError?.type === "unknown" && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{analysisError.message}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.analyzeButton,
            (!description.trim() || isQuotaExhausted) && styles.analyzeButtonDisabled,
          ]}
          onPress={handleAnalyze}
          disabled={!description.trim() || isQuotaExhausted}
        >
          <Text style={styles.analyzeButtonText}>Analyze with AI</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkipAI}>
          <Text style={styles.skipButtonText}>Skip AI — enter manually</Text>
        </TouchableOpacity>
      </View>
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
  quotaText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textMuted,
    textAlign: "center",
  },
  errorBanner: {
    backgroundColor: colors.errorLight,
    borderRadius: 10,
    padding: spacing.md,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.error,
    textAlign: "center",
    lineHeight: 20,
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
  skipButton: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textSecondary,
  },
});
