import * as SecureStore from "expo-secure-store";
import { callQuota, type QuotaInfo } from "./proxy";

const CACHE_KEY = "cached_quota";

export async function getCachedQuota(): Promise<QuotaInfo | null> {
  const raw = await SecureStore.getItemAsync(CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuotaInfo;
  } catch {
    return null;
  }
}

async function setCachedQuota(quota: QuotaInfo): Promise<void> {
  await SecureStore.setItemAsync(CACHE_KEY, JSON.stringify(quota));
}

export async function syncQuota(): Promise<QuotaInfo> {
  const quota = await callQuota();
  await setCachedQuota(quota);
  return quota;
}
