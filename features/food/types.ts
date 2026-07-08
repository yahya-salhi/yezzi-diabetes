export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type FoodLog = {
  id: string;
  meal_type: MealType;
  date: string;
  time: string;
  photo_uri: string | null;
  food_name: string;
  carbs_g: number;
  protein_g: number | null;
  fat_g: number | null;
  calories: number;
  estimated_impact: number;
  notes: string | null;
  created_at: string;
};

export type InsertFoodLog = {
  id: string;
  meal_type: MealType;
  date: string;
  time: string;
  photo_uri?: string | null;
  food_name: string;
  carbs_g: number;
  protein_g?: number | null;
  fat_g?: number | null;
  calories: number;
  estimated_impact: number;
  notes?: string | null;
};

export type MealSpike = {
  meal_id: string;
  food_name: string;
  meal_type: MealType;
  date: string;
  meal_time: string;
  estimated_impact: number;
  baseline_value: number;
  post_meal_value: number;
  actual_impact: number;
};
