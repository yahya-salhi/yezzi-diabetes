import { getDb } from "@/db/database";

export type UserPreferences = {
  unit: "mg/dL" | "mmol/L";
  fasting_target_low: number;
  fasting_target_high: number;
  postmeal_target_low: number;
  postmeal_target_high: number;
};

const DEFAULTS: UserPreferences = {
  unit: "mg/dL",
  fasting_target_low: 70,
  fasting_target_high: 100,
  postmeal_target_low: 70,
  postmeal_target_high: 140,
};

export async function getPreferences(): Promise<UserPreferences | null> {
  try {
    const db = await getDb();
    const row = await db.getFirstAsync<{
      id: string;
      unit: string;
      fasting_target_low: number;
      fasting_target_high: number;
      postmeal_target_low: number;
      postmeal_target_high: number;
    }>("SELECT * FROM user_preferences WHERE id = 'default'");

    if (!row) return null;

    return {
      unit: row.unit as "mg/dL" | "mmol/L",
      fasting_target_low: row.fasting_target_low,
      fasting_target_high: row.fasting_target_high,
      postmeal_target_low: row.postmeal_target_low,
      postmeal_target_high: row.postmeal_target_high,
    };
  } catch (err) {
    console.error("[preferences] getPreferences failed", err);
    return null;
  }
}

export async function upsertPreferences(
  prefs: Partial<UserPreferences>
): Promise<void> {
  try {
    const db = await getDb();
    const existing = await getPreferences();
    const merged = { ...DEFAULTS, ...existing, ...prefs };

    await db.runAsync(
      `INSERT OR REPLACE INTO user_preferences
       (id, unit, fasting_target_low, fasting_target_high, postmeal_target_low, postmeal_target_high, updated_at)
       VALUES ('default', ?, ?, ?, ?, ?, datetime('now'))`,
      [
        merged.unit,
        merged.fasting_target_low,
        merged.fasting_target_high,
        merged.postmeal_target_low,
        merged.postmeal_target_high,
      ]
    );
  } catch (err) {
    console.error("[preferences] upsertPreferences failed", err);
    throw err;
  }
}
