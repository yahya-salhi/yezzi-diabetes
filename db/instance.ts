import { createSqliteDb } from "./sqlite-adapter";
import type { DatabasePort } from "./port";

let instance: DatabasePort | null = null;

export function getDbAdapter(): DatabasePort {
  if (!instance) {
    instance = createSqliteDb();
  }
  return instance;
}

export function initDb(adapter: DatabasePort): void {
  instance = adapter;
}
