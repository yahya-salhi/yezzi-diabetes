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

type ColumnSchema = {
  required: boolean;
  type: "string" | "number" | "number|null";
};

const TABLE_SCHEMAS: Record<string, Record<string, ColumnSchema>> = {
  glucose_readings: {
    id: { required: true, type: "string" },
    value: { required: true, type: "number" },
    unit: { required: true, type: "string" },
    type: { required: true, type: "string" },
    date: { required: true, type: "string" },
    time: { required: true, type: "string" },
    food_log_id: { required: false, type: "number|null" },
    workout_session_id: { required: false, type: "number|null" },
    notes: { required: false, type: "number|null" },
    created_at: { required: true, type: "string" },
  },
  food_log: {
    id: { required: true, type: "string" },
    meal_type: { required: true, type: "string" },
    date: { required: true, type: "string" },
    time: { required: true, type: "string" },
    photo_uri: { required: false, type: "number|null" },
    food_name: { required: true, type: "string" },
    carbs_g: { required: true, type: "number" },
    protein_g: { required: false, type: "number|null" },
    fat_g: { required: false, type: "number|null" },
    calories: { required: true, type: "number" },
    estimated_impact: { required: true, type: "number" },
    notes: { required: false, type: "number|null" },
    created_at: { required: true, type: "string" },
  },
  user_preferences: {
    id: { required: true, type: "string" },
    unit: { required: true, type: "string" },
    fasting_target_low: { required: true, type: "number" },
    fasting_target_high: { required: true, type: "number" },
    postmeal_target_low: { required: true, type: "number" },
    postmeal_target_high: { required: true, type: "number" },
    last_backup_at: { required: false, type: "number|null" },
    created_at: { required: true, type: "string" },
    updated_at: { required: true, type: "string" },
  },
  reminder_preferences: {
    id: { required: true, type: "string" },
    reminder_type: { required: true, type: "string" },
    enabled: { required: true, type: "number" },
    hour: { required: false, type: "number|null" },
    minute: { required: false, type: "number|null" },
    created_at: { required: true, type: "string" },
    updated_at: { required: true, type: "string" },
  },
};

function validateRow(
  row: unknown,
  tableName: string,
  rowIndex: number,
): string | null {
  if (!row || typeof row !== "object") {
    return `${tableName}[${rowIndex}]: not an object`;
  }
  const r = row as Record<string, unknown>;
  const schema = TABLE_SCHEMAS[tableName];

  for (const [col, rules] of Object.entries(schema)) {
    const val = r[col];
    if (rules.required && val === undefined) {
      return `${tableName}[${rowIndex}]: missing required column "${col}"`;
    }
    if (val === undefined || val === null) continue;
    if (rules.type === "string" && typeof val !== "string") {
      return `${tableName}[${rowIndex}]: column "${col}" expected string, got ${typeof val}`;
    }
    if (rules.type === "number" && typeof val !== "number") {
      return `${tableName}[${rowIndex}]: column "${col}" expected number, got ${typeof val}`;
    }
  }

  return null;
}

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

    const schema = TABLE_SCHEMAS[table];
    for (let i = 0; i < tables[table].length; i++) {
      const err = validateRow(tables[table][i], table, i);
      if (err) return err;
    }
  }

  return null;
}

function escapeSql(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return `'${value.replace(/'/g, "''")}'`;
  throw new Error(`Unexpected type in backup value: ${typeof value}`);
}

function buildBatchInsert(
  table: string,
  columns: string[],
  rows: Record<string, unknown>[],
): string {
  if (rows.length === 0) return "";
  const values = rows.map(
    (row) => `(${columns.map((col) => escapeSql(row[col])).join(", ")})`,
  );
  return `INSERT INTO ${table} (${columns.join(", ")}) VALUES ${values.join(", ")}`;
}

const TABLE_COLUMNS: Record<string, string[]> = {
  glucose_readings: [
    "id", "value", "unit", "type", "date", "time",
    "food_log_id", "workout_session_id", "notes", "created_at",
  ],
  food_log: [
    "id", "meal_type", "date", "time", "photo_uri", "food_name",
    "carbs_g", "protein_g", "fat_g", "calories", "estimated_impact",
    "notes", "created_at",
  ],
  user_preferences: [
    "id", "unit", "fasting_target_low", "fasting_target_high",
    "postmeal_target_low", "postmeal_target_high", "last_backup_at",
    "created_at", "updated_at",
  ],
  reminder_preferences: [
    "id", "reminder_type", "enabled", "hour", "minute",
    "created_at", "updated_at",
  ],
};

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

    for (const table of EXPECTED_TABLES) {
      const rows = tables[table];
      if (rows.length === 0) continue;
      const sql = buildBatchInsert(table, TABLE_COLUMNS[table], rows);
      await adapter.execAsync(sql);
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
