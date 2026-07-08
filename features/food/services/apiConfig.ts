import * as SecureStore from "expo-secure-store";

const STORAGE_KEY = "openai_api_key";

export async function getApiKey(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function setApiKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(STORAGE_KEY, key);
}
