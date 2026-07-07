export type ReadingType = "fasting" | "pre_meal" | "post_meal" | "bedtime" | "other";

export type GlucoseReading = {
  id: string;
  value: number;
  unit: "mg/dL" | "mmol/L";
  type: ReadingType;
  date: string;
  time: string;
  food_log_id: string | null;
  workout_session_id: string | null;
  notes: string | null;
  created_at: string;
};

export type InsertReading = Omit<GlucoseReading, "created_at">;
