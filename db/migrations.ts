import type { SQLiteDatabase } from "expo-sqlite";

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS glucose_readings (
      id TEXT PRIMARY KEY,
      value REAL NOT NULL,
      unit TEXT NOT NULL CHECK(unit IN ('mg/dL', 'mmol/L')),
      type TEXT NOT NULL CHECK(type IN ('fasting', 'pre_meal', 'post_meal', 'bedtime', 'other')),
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      food_log_id TEXT,
      workout_session_id TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_readings_date ON glucose_readings(date);
    CREATE INDEX IF NOT EXISTS idx_readings_type ON glucose_readings(type);
    CREATE INDEX IF NOT EXISTS idx_readings_date_type ON glucose_readings(date, type);

    CREATE TABLE IF NOT EXISTS food_log (
      id TEXT PRIMARY KEY,
      meal_type TEXT NOT NULL CHECK(meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      photo_uri TEXT,
      food_name TEXT NOT NULL,
      carbs_g REAL NOT NULL,
      protein_g REAL,
      fat_g REAL,
      calories REAL NOT NULL,
      estimated_impact REAL NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_food_log_date ON food_log(date);
    CREATE INDEX IF NOT EXISTS idx_food_log_meal_type ON food_log(meal_type);

    CREATE TABLE IF NOT EXISTS user_preferences (
      id TEXT PRIMARY KEY DEFAULT 'default',
      unit TEXT NOT NULL DEFAULT 'mg/dL' CHECK(unit IN ('mg/dL', 'mmol/L')),
      fasting_target_low REAL DEFAULT 70,
      fasting_target_high REAL DEFAULT 100,
      postmeal_target_low REAL DEFAULT 70,
      postmeal_target_high REAL DEFAULT 140,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reminder_preferences (
      id TEXT PRIMARY KEY,
      reminder_type TEXT NOT NULL CHECK(reminder_type IN ('fasting', 'pre_meal', 'post_meal', 'bedtime', 'other', 'weekly_summary')),
      enabled INTEGER NOT NULL DEFAULT 0,
      hour INTEGER,
      minute INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
