import { getDb } from "./database";
import type { DatabasePort } from "./port";

export function createSqliteDb(): DatabasePort {
  return {
    async getAllAsync(sql, params) {
      const db = await getDb();
      return db.getAllAsync(sql, params ?? []);
    },
    async getFirstAsync(sql, params) {
      const db = await getDb();
      return db.getFirstAsync(sql, params ?? []);
    },
    async runAsync(sql, params) {
      const db = await getDb();
      await db.runAsync(sql, params ?? []);
    },
    async execAsync(sql) {
      const db = await getDb();
      await db.execAsync(sql);
    },
  };
}
