import { useState, useCallback } from "react";
import { randomUUID } from "expo-crypto";
import { format } from "date-fns";
import { useFoodLogRepo } from "@/features/repos/RepoContext";
import type { FoodLog, MealType } from "../types";

export type SaveMealParams = {
  meal_type: MealType;
  food_name: string;
  calories: number;
  carbs_g: number;
  protein_g: number | null;
  fat_g: number | null;
  estimated_impact: number;
  photo_uri?: string | null;
  notes?: string | null;
};

type UseFoodLogResult = {
  saving: boolean;
  error: string | null;
  saveMeal: (params: SaveMealParams) => Promise<void>;
  getTodaysMeals: () => Promise<FoodLog[]>;
};

export function useFoodLog(): UseFoodLogResult {
  const foodLogRepo = useFoodLogRepo();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveMeal = useCallback(async (params: SaveMealParams) => {
    setSaving(true);
    setError(null);

    try {
      const now = new Date();
      await foodLogRepo.insert({
        id: randomUUID(),
        meal_type: params.meal_type,
        date: format(now, "yyyy-MM-dd"),
        time: format(now, "HH:mm"),
        photo_uri: params.photo_uri ?? null,
        food_name: params.food_name,
        carbs_g: params.carbs_g,
        protein_g: params.protein_g,
        fat_g: params.fat_g,
        calories: params.calories,
        estimated_impact: params.estimated_impact,
        notes: params.notes ?? null,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save meal";
      setError(msg);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const getTodaysMeals = useCallback(async (): Promise<FoodLog[]> => {
    try {
      return await foodLogRepo.getByDate(format(new Date(), "yyyy-MM-dd"));
    } catch {
      return [];
    }
  }, []);

  return { saving, error, saveMeal, getTodaysMeals };
}
