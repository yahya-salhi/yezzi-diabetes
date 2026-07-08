import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { FoodStackParamList } from "@/navigation/types";
import { colors, spacing } from "@/theme/tokens";
import { CameraView } from "@/features/food/components/CameraView";
import { MealReviewForm } from "@/features/food/components/MealReviewForm";
import { useMealAnalysis } from "@/features/food/hooks/useMealAnalysis";
import { useFoodLog } from "@/features/food/hooks/useFoodLog";
import type { MealType } from "@/features/food/types";

type ScreenMode = "camera" | "loading" | "review";

export function SnapMealScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FoodStackParamList>>();
  const { analyzing, needsKey, analyzePhoto, provideApiKey, dismissKeyPrompt } = useMealAnalysis();
  const { saving, error: saveError, saveMeal } = useFoodLog();

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
  const [keyInput, setKeyInput] = useState("");

  const handleCapture = async (uri: string) => {
    setPhotoUri(uri);
    setMode("loading");

    const result = await analyzePhoto(uri);

    if (result) {
      setFoodName(result.food_name);
      setCalories(String(result.calories));
      setCarbsG(String(result.carbs_g));
      setProteinG(result.protein_g !== null ? String(result.protein_g) : "");
      setFatG(result.fat_g !== null ? String(result.fat_g) : "");
      setEstimatedImpact(result.estimated_impact_mgdl);
      setMode("review");
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

  const handleProvideKey = async () => {
    if (!keyInput.trim()) return;
    await provideApiKey(keyInput.trim());
    setKeyInput("");
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
