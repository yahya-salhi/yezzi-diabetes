import { Paths, File } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { getDbAdapter } from "@/db/instance";
import type { DatabasePort } from "@/db/port";

const BACKUP_VERSION = 1;

type GlucoseReading = {
  id: string;
  value: number;
  unit: "mg/dL" | "mmol/L";
  type: "fasting" | "pre_meal" | "post_meal" | "bedtime" | "other";
  date: string;
  time: string;
  food_log_id: string | null;
  workout_session_id: string | null;
  notes: string | null;
  created_at: string;
};

type FoodLog = {
  id: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
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

type UserPreference = {
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

type ReminderPreference = {
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
    user_preferences: UserPreference[];
    reminder_preferences: ReminderPreference[];
  };
};

export async function createBackup(db?: DatabasePort): Promise<BackupData> {
  const adapter = db ?? getDbAdapter();

  const [glucose_readings, food_log, user_preferences, reminder_preferences] =
    await Promise.all([
      adapter.getAllAsync("SELECT * FROM glucose_readings") as Promise<GlucoseReading[]>,
      adapter.getAllAsync("SELECT * FROM food_log") as Promise<FoodLog[]>,
      adapter.getAllAsync("SELECT * FROM user_preferences") as Promise<UserPreference[]>,
      adapter.getAllAsync("SELECT * FROM reminder_preferences") as Promise<ReminderPreference[]>,
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

export async function saveBackupFile(backup: BackupData): Promise<void> {
  const filename = getBackupFilename();
  const file = new File(Paths.document, filename);
  file.write(JSON.stringify(backup, null, 2));

  await Sharing.shareAsync(file.uri, {
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
