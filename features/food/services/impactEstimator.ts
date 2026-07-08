import { getDbAdapter } from "@/db/instance";
import type { DatabasePort } from "@/db/port";
import type { MealSpike, MealType } from "../types";

type SpikeRow = {
  id: string;
  food_name: string;
  meal_type: string;
  date: string;
  time: string;
  estimated_impact: number;
  post_meal_value: number;
  baseline_value: number | null;
};

export interface ImpactEstimator {
  getTopSpikes(days: number): Promise<MealSpike[]>;
}

export function createSqliteImpactEstimator(db?: DatabasePort): ImpactEstimator {
  const adapter = db ?? getDbAdapter();

  return {
    async getTopSpikes(days: number): Promise<MealSpike[]> {
      try {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const cutoffDate = cutoff.toISOString().slice(0, 10);

        const rows = await adapter.getAllAsync<SpikeRow>(
          `SELECT
             fl.id,
             fl.food_name,
             fl.meal_type,
             gr.date,
             gr.time,
             fl.estimated_impact,
             gr.value AS post_meal_value,
             (SELECT g2.value FROM glucose_readings g2
              WHERE g2.date = gr.date
                AND g2.time <= gr.time
                AND (g2.type = 'fasting' OR g2.type = 'pre_meal')
              ORDER BY g2.time DESC
              LIMIT 1) AS baseline_value
           FROM glucose_readings gr
           JOIN food_log fl ON fl.id = gr.food_log_id
           WHERE gr.food_log_id IS NOT NULL
             AND gr.type = 'post_meal'
             AND gr.date >= ?
           ORDER BY gr.date DESC, gr.time ASC`,
          [cutoffDate],
        );

        return rows
          .filter((r) => r.baseline_value !== null)
          .map((r) => ({
            meal_id: r.id,
            food_name: r.food_name,
            meal_type: r.meal_type as MealType,
            date: r.date,
            meal_time: r.time,
            estimated_impact: r.estimated_impact,
            baseline_value: r.baseline_value!,
            post_meal_value: r.post_meal_value,
            actual_impact: Math.round((r.post_meal_value - r.baseline_value!) * 10) / 10,
          }))
          .sort((a, b) => b.actual_impact - a.actual_impact)
          .slice(0, 3);
      } catch (err) {
        console.error("[impactEstimator] getTopSpikes failed", err);
        return [];
      }
    },
  };
}

export function createFakeImpactEstimator(): ImpactEstimator {
  return {
    async getTopSpikes(_days: number): Promise<MealSpike[]> {
      return [];
    },
  };
}
