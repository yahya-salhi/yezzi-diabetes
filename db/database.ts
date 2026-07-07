import type { SQLiteDatabase } from "expo-sqlite";
import { runMigrations } from "./migrations";

let dbPromise: Promise<SQLiteDatabase> | null = null;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function openDbWithRetry(maxRetries = 5): Promise<SQLiteDatabase> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const SQLite = await import("expo-sqlite");
      const db = await SQLite.openDatabaseAsync("yezzi.db");
      await runMigrations(db);
      return db;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("runtime not ready") && attempt < maxRetries - 1) {
        await delay(500 * (attempt + 1));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Failed to open database after retries");
}

export function getDb(): Promise<SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = openDbWithRetry();
  }
  return dbPromise;
}
