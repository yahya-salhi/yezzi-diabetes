import { getDbAdapter } from "@/db/instance";
import type { DatabasePort } from "@/db/port";
import type { FoodLog, InsertFoodLog } from "../types";

export interface FoodLogRepo {
  getUnlinkedMeals(date: string): Promise<FoodLog[]>;
  insert(meal: InsertFoodLog): Promise<void>;
  getById(id: string): Promise<FoodLog | null>;
  getByDate(date: string): Promise<FoodLog[]>;
  deleteById(id: string): Promise<void>;
}

export function createSqliteFoodLog(db?: DatabasePort): FoodLogRepo {
  const adapter = db ?? getDbAdapter();

  return {
    async getUnlinkedMeals(date) {
      try {
        return await adapter.getAllAsync<FoodLog>(
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

    async insert(meal) {
      try {
        await adapter.runAsync(
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

    async getById(id) {
      try {
        return await adapter.getFirstAsync<FoodLog>(
          "SELECT * FROM food_log WHERE id = ?",
          [id],
        );
      } catch (err) {
        console.error("[foodLog] getById failed", err);
        return null;
      }
    },

    async getByDate(date) {
      try {
        return await adapter.getAllAsync<FoodLog>(
          "SELECT * FROM food_log WHERE date = ? ORDER BY time ASC",
          [date],
        );
      } catch (err) {
        console.error("[foodLog] getByDate failed", err);
        return [];
      }
    },

    async deleteById(id) {
      try {
        await adapter.runAsync("DELETE FROM food_log WHERE id = ?", [id]);
      } catch (err) {
        console.error("[foodLog] deleteById failed", err);
        throw err;
      }
    },
  };
}

export function createFakeFoodLog(): FoodLogRepo {
  const store: FoodLog[] = [];

  return {
    async getUnlinkedMeals(date) {
      return store.filter((m) => m.date === date);
    },

    async insert(meal) {
      store.push({
        ...meal,
        photo_uri: meal.photo_uri ?? null,
        protein_g: meal.protein_g ?? null,
        fat_g: meal.fat_g ?? null,
        notes: meal.notes ?? null,
        created_at: new Date().toISOString(),
      });
    },

    async getById(id) {
      return store.find((m) => m.id === id) ?? null;
    },

    async getByDate(date) {
      return store.filter((m) => m.date === date);
    },

    async deleteById(id) {
      const idx = store.findIndex((m) => m.id === id);
      if (idx >= 0) store.splice(idx, 1);
    },
  };
}
