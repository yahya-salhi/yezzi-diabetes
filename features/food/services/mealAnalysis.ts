export type MealAnalysisResult = {
  food_name: string;
  calories: number;
  carbs_g: number;
  protein_g: number | null;
  fat_g: number | null;
  estimated_impact_mgdl: number;
};
