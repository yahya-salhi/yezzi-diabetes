import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, shadows } from "@/theme/tokens";
import { Button } from "@/components/ui/Button";
import { CameraView } from "@/features/food/components/CameraView";
import { NutritionBreakdown } from "@/features/food/components/NutritionBreakdown";
import { EstimatedImpactBadge } from "@/features/food/components/EstimatedImpactBadge";
import type { MealType } from "@/features/food/types";

type ScreenMode = "camera" | "loading" | "review";

const MEAL_TYPES: { key: MealType; label: string }[] = [
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
  { key: "snack", label: "Snack" },
];

export function SnapMealScreen() {
  const navigation = useNavigation();
  const [mode, setMode] = useState<ScreenMode>("camera");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [carbsG, setCarbsG] = useState("");
  const [proteinG, setProteinG] = useState("");
  const [fatG, setFatG] = useState("");
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [notes, setNotes] = useState("");

  const handleCapture = (uri: string) => {
    setPhotoUri(uri);
    setMode("loading");
    setTimeout(() => {
      setFoodName("Grilled Chicken Salad");
      setCalories("420");
      setCarbsG("18");
      setProteinG("35");
      setFatG("24");
      setMode("review");
    }, 1800);
  };

  const handleSave = () => {
    navigation.goBack();
  };

  if (mode === "camera") {
    return <CameraView onCapture={handleCapture} onClose={() => navigation.goBack()} />;
  }

  if (mode === "loading") {
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {photoUri && (
        <Image source={{ uri: photoUri }} style={styles.photo} />
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Food Name</Text>
        <TextInput
          style={styles.input}
          value={foodName}
          onChangeText={setFoodName}
          placeholder="e.g. Grilled Chicken Salad"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <NutritionBreakdown
        calories={calories}
        carbsG={carbsG}
        proteinG={proteinG}
        fatG={fatG}
        onCaloriesChange={setCalories}
        onCarbsChange={setCarbsG}
        onProteinChange={setProteinG}
        onFatChange={setFatG}
      />

      <EstimatedImpactBadge impact={32} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meal Type</Text>
        <View style={styles.typeRow}>
          {MEAL_TYPES.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.typeChip, mealType === t.key && styles.typeChipSelected]}
              onPress={() => setMealType(t.key)}
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
          onChangeText={setNotes}
          placeholder="Optional notes about this meal"
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.actions}>
        <Button title="Save Meal" onPress={handleSave} />
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
    padding: spacing.xl,
    gap: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
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
  actions: {
    gap: spacing.md,
    paddingTop: spacing.md,
  },
});
