import * as SecureStore from "expo-secure-store";
import { getDbAdapter } from "@/db/instance";
import type { DatabasePort } from "@/db/port";
import { getSubscriptionService } from "@/features/plus/services/subscription";

const TABLES = [
  "glucose_readings",
  "food_log",
  "reminder_preferences",
  "user_preferences",
];

const SECURE_STORE_KEYS = ["device_uuid", "cached_quota"];

export async function deleteAllData(db?: DatabasePort): Promise<void> {
  const adapter = db ?? getDbAdapter();

  for (const table of TABLES) {
    await adapter.runAsync(`DELETE FROM ${table}`);
  }

  for (const key of SECURE_STORE_KEYS) {
    await SecureStore.deleteItemAsync(key);
  }

  try {
    await getSubscriptionService().logout();
  } catch {
    // logout is best-effort — local data wipe is the priority
  }
}
