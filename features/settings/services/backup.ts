import { Paths, File } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { getDbAdapter } from "@/db/instance";
import type { DatabasePort } from "@/db/port";
import type { GlucoseReading } from "@/features/glucose/types";
import type { FoodLog } from "@/features/food/types";

export const BACKUP_VERSION = 1;

export type UserPreferenceRow = {
  id: string;
  unit: "mg/dL" | "mmol/L";
  fasting_target_low: number;
  fasting_target_high: number;
  postmeal_target_low: number;
  postmeal_target_high: number;
  last_backup_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ReminderPreferenceRow = {
  id: string;
  reminder_type:
    | "fasting"
    | "pre_meal"
    | "post_meal"
    | "bedtime"
    | "other"
    | "weekly_summary";
  enabled: number;
  hour: number | null;
  minute: number | null;
  created_at: string;
  updated_at: string;
};

export type BackupData = {
  version: number;
  exportedAt: string;
  tables: {
    glucose_readings: GlucoseReading[];
    food_log: FoodLog[];
    user_preferences: UserPreferenceRow[];
    reminder_preferences: ReminderPreferenceRow[];
  };
};

export async function createBackup(db?: DatabasePort): Promise<BackupData> {
  const adapter = db ?? getDbAdapter();

  const [glucose_readings, food_log, user_preferences, reminder_preferences] =
    await Promise.all([
      adapter.getAllAsync("SELECT * FROM glucose_readings") as Promise<GlucoseReading[]>,
      adapter.getAllAsync("SELECT * FROM food_log") as Promise<FoodLog[]>,
      adapter.getAllAsync("SELECT * FROM user_preferences") as Promise<UserPreferenceRow[]>,
      adapter.getAllAsync("SELECT * FROM reminder_preferences") as Promise<ReminderPreferenceRow[]>,
    ]);

  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    tables: { glucose_readings, food_log, user_preferences, reminder_preferences },
  };
}

function getBackupFilename(): string {
  const d = new Date();
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return `yezzi-backup-${date}.json`;
}

export function writeBackup(backup: BackupData): string {
  const filename = getBackupFilename();
  const file = new File(Paths.document, filename);
  file.write(JSON.stringify(backup, null, 2));
  return file.uri;
}

export async function shareBackup(uri: string): Promise<void> {
  await Sharing.shareAsync(uri, {
    mimeType: "application/json",
    dialogTitle: "Back up your YeZZi data",
  });
}

export async function updateLastBackupTimestamp(db?: DatabasePort): Promise<void> {
  const adapter = db ?? getDbAdapter();
  await adapter.runAsync(
    `UPDATE user_preferences SET last_backup_at = datetime('now'), updated_at = datetime('now') WHERE id = 'default'`,
  );
}

export async function needsBackup(db?: DatabasePort): Promise<boolean> {
  const adapter = db ?? getDbAdapter();
  const prefs = await adapter.getFirstAsync<{ last_backup_at: string | null }>(
    "SELECT last_backup_at FROM user_preferences WHERE id = 'default'",
  );
  if (prefs?.last_backup_at) return false;

  const row = await adapter.getFirstAsync<{ count: number }>(
    "SELECT COUNT(DISTINCT date) as count FROM glucose_readings",
  );
  return (row?.count ?? 0) >= 30;
}
