import { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { FoodStackParamList } from "@/navigation/types";
import { colors, spacing } from "@/theme/tokens";
import { CameraView } from "@/features/food/components/CameraView";
import { MealReviewForm } from "@/features/food/components/MealReviewForm";
import { useMealAnalysis } from "@/features/food/hooks/useMealAnalysis";
import { useFoodLog } from "@/features/food/hooks/useFoodLog";
import { useQuota } from "@/features/food/hooks/useQuota";
import type { MealType } from "@/features/food/types";

type ScreenMode = "camera" | "loading" | "review";

export function SnapMealScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FoodStackParamList>>();
  const { analyzing, analyzePhoto } = useMealAnalysis();
  const { saving, error: saveError, saveMeal } = useFoodLog();
  const { refresh: refreshQuota } = useQuota();

  const [mode, setMode] = useState<ScreenMode>("camera");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [carbsG, setCarbsG] = useState("");
  const [proteinG, setProteinG] = useState("");
  const [fatG, setFatG] = useState("");
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [notes, setNotes] = useState("");
  const [estimatedImpact, setEstimatedImpact] = useState(0);

  const handleCapture = async (uri: string) => {
    setPhotoUri(uri);
    setMode("loading");

    const result = await analyzePhoto(uri);

    if (result) {
      setPhotoUri(result.photoPath);
      setFoodName(result.analysis.food_name);
      setCalories(String(result.analysis.calories));
      setCarbsG(String(result.analysis.carbs_g));
      setProteinG(result.analysis.protein_g !== null ? String(result.analysis.protein_g) : "");
      setFatG(result.analysis.fat_g !== null ? String(result.analysis.fat_g) : "");
      setEstimatedImpact(result.analysis.estimated_impact_mgdl);
      setMode("review");
      refreshQuota();
    } else {
      navigation.navigate("ManualEntry", { photoUri: uri });
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
        photo_uri: photoUri,
        notes: notes || null,
      });
      navigation.goBack();
    } catch {
      // saveError is set by the hook
    }
  };

  if (mode === "camera") {
    return <CameraView onCapture={handleCapture} onClose={() => navigation.goBack()} />;
  }

  if (mode === "loading" || analyzing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <View style={styles.loadingContent}>
          <View style={styles.skeletonPhoto} />
          <View style={styles.skeletonRow}>
            <View style={styles.skeletonLine} />
            <View style={styles.skeletonShort} />
          </View>
          <View style={styles.skeletonGrid}>
            <View style={styles.skeletonBox} />
            <View style={styles.skeletonBox} />
          </View>
        </View>
        <Text style={styles.loadingText}>Analyzing your meal...</Text>
      </View>
    );
  }

  return (
    <>
      <MealReviewForm
        photoUri={photoUri}
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
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.xxl,
  },
  loadingContent: {
    width: "100%",
    gap: spacing.lg,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  skeletonPhoto: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    backgroundColor: colors.borderLight,
  },
  skeletonRow: {
    gap: spacing.sm,
  },
  skeletonLine: {
    height: 18,
    borderRadius: 8,
    backgroundColor: colors.borderLight,
    width: "60%",
  },
  skeletonShort: {
    height: 14,
    borderRadius: 8,
    backgroundColor: colors.borderLight,
    width: "30%",
  },
  skeletonGrid: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  skeletonBox: {
    flex: 1,
    height: 60,
    borderRadius: 10,
    backgroundColor: colors.borderLight,
  },
});
