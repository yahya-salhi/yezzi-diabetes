import * as SecureStore from "expo-secure-store";
import { randomUUID } from "expo-crypto";

const STORAGE_KEY = "device_uuid";

export async function getDeviceId(): Promise<string> {
  const existing = await SecureStore.getItemAsync(STORAGE_KEY);
  if (existing) return existing;

  const id = randomUUID();
  await SecureStore.setItemAsync(STORAGE_KEY, id);
  return id;
}
