import type { DatabasePort } from "@/db/port";
import type { FoodLog, InsertFoodLog } from "../types";

export function createSqliteFoodLog(db: DatabasePort) {
  return {
    async getUnlinkedMeals(date: string): Promise<FoodLog[]> {
      try {
        return await db.getAllAsync<FoodLog>(
          `SELECT f.* FROM food_log f
           WHERE f.date = ?
           AND f.id NOT IN (
             SELECT food_log_id FROM glucose_readings WHERE food_log_id IS NOT NULL
           )
           ORDER BY f.time ASC`,
          [date],
        );
      } catch (err) {
        console.error("[foodLog] getUnlinkedMeals failed", err);
        return [];
      }
    },

    async insert(meal: InsertFoodLog): Promise<void> {
      try {
        await db.runAsync(
          `INSERT INTO food_log (id, meal_type, date, time, photo_uri, food_name, carbs_g, protein_g, fat_g, calories, estimated_impact, notes, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          [
            meal.id,
            meal.meal_type,
            meal.date,
            meal.time,
            meal.photo_uri ?? null,
            meal.food_name,
            meal.carbs_g,
            meal.protein_g ?? null,
            meal.fat_g ?? null,
            meal.calories,
            meal.estimated_impact,
            meal.notes ?? null,
          ],
        );
      } catch (err) {
        console.error("[foodLog] insert failed", err);
        throw err;
      }
    },

    async getById(id: string): Promise<FoodLog | null> {
      try {
        return await db.getFirstAsync<FoodLog>(
          "SELECT * FROM food_log WHERE id = ?",
          [id],
        );
      } catch (err) {
        console.error("[foodLog] getById failed", err);
        return null;
      }
    },

    async getByDate(date: string): Promise<FoodLog[]> {
      try {
        return await db.getAllAsync<FoodLog>(
          "SELECT * FROM food_log WHERE date = ? ORDER BY time ASC",
          [date],
        );
      } catch (err) {
        console.error("[foodLog] getByDate failed", err);
        return [];
      }
    },

    async deleteById(id: string): Promise<void> {
      try {
        await db.runAsync("DELETE FROM food_log WHERE id = ?", [id]);
      } catch (err) {
        console.error("[foodLog] deleteById failed", err);
        throw err;
      }
    },
  };
}
