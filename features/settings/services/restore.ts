import * as DocumentPicker from "expo-document-picker";
import { getDbAdapter } from "@/db/instance";
import type { DatabasePort } from "@/db/port";
import type { BackupData } from "./backup";
import { BACKUP_VERSION } from "./backup";

const EXPECTED_TABLES = [
  "glucose_readings",
  "food_log",
  "user_preferences",
  "reminder_preferences",
] as const;

export async function pickBackupFile(): Promise<BackupData | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/json",
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets?.[0]) return null;

  try {
    const content = await fetch(result.assets[0].uri);
    const text = await content.text();
    return JSON.parse(text) as BackupData;
  } catch {
    return null;
  }
}

export function validateBackup(backup: unknown): string | null {
  if (!backup || typeof backup !== "object") return "Invalid backup file";
  const b = backup as Record<string, unknown>;
  if (typeof b.version !== "number") return "Missing backup version";
  if (b.version > BACKUP_VERSION) return "Backup version not supported by this app version";
  if (!b.tables || typeof b.tables !== "object")
    return "Missing backup tables";

  const tables = b.tables as Record<string, unknown>;
  for (const table of EXPECTED_TABLES) {
    if (!Array.isArray(tables[table]))
      return `Missing table: ${table}`;
  }

  return null;
}

export async function applyBackup(
  backup: BackupData,
  db?: DatabasePort,
): Promise<void> {
  const adapter = db ?? getDbAdapter();
  const { tables } = backup;

  await adapter.runAsync("BEGIN TRANSACTION");
  try {
    await adapter.runAsync("DELETE FROM glucose_readings");
    await adapter.runAsync("DELETE FROM food_log");
    await adapter.runAsync("DELETE FROM user_preferences");
    await adapter.runAsync("DELETE FROM reminder_preferences");

    for (const row of tables.glucose_readings) {
      await adapter.runAsync(
        `INSERT INTO glucose_readings (id, value, unit, type, date, time, food_log_id, workout_session_id, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          row.id,
          row.value,
          row.unit,
          row.type,
          row.date,
          row.time,
          row.food_log_id ?? null,
          row.workout_session_id ?? null,
          row.notes ?? null,
          row.created_at,
        ],
      );
    }

    for (const row of tables.food_log) {
      await adapter.runAsync(
        `INSERT INTO food_log (id, meal_type, date, time, photo_uri, food_name, carbs_g, protein_g, fat_g, calories, estimated_impact, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          row.id,
          row.meal_type,
          row.date,
          row.time,
          row.photo_uri ?? null,
          row.food_name,
          row.carbs_g,
          row.protein_g ?? null,
          row.fat_g ?? null,
          row.calories,
          row.estimated_impact,
          row.notes ?? null,
          row.created_at,
        ],
      );
    }

    for (const row of tables.user_preferences) {
      await adapter.runAsync(
        `INSERT INTO user_preferences (id, unit, fasting_target_low, fasting_target_high, postmeal_target_low, postmeal_target_high, last_backup_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          row.id,
          row.unit,
          row.fasting_target_low,
          row.fasting_target_high,
          row.postmeal_target_low,
          row.postmeal_target_high,
          row.last_backup_at ?? null,
          row.created_at,
          row.updated_at,
        ],
      );
    }

    for (const row of tables.reminder_preferences) {
      await adapter.runAsync(
        `INSERT INTO reminder_preferences (id, reminder_type, enabled, hour, minute, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          row.id,
          row.reminder_type,
          row.enabled,
          row.hour ?? null,
          row.minute ?? null,
          row.created_at,
          row.updated_at,
        ],
      );
    }

    await adapter.runAsync("COMMIT");
  } catch (err) {
    try {
      await adapter.runAsync("ROLLBACK");
    } catch {
      // rollback failed — original error is more informative
    }
    throw err;
  }
}
