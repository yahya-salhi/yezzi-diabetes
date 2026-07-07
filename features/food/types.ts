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
