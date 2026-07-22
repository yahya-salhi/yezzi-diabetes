import * as SecureStore from "expo-secure-store";
import Purchases from "react-native-purchases";
import { getDbAdapter } from "@/db/instance";
import type { DatabasePort } from "@/db/port";

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
    await Purchases.logOut();
  } catch {
    // RevenueCat logOut is best-effort — local data wipe is the priority
  }
}
