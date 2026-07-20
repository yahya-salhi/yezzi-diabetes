import * as SecureStore from "expo-secure-store";
import { randomUUID } from "expo-crypto";
import type { MealAnalysisResult } from "./mealAnalysis";

const PROXY_BASE_URL = "https://ai-proxy.pcclub10.workers.dev";
const DEVICE_UUID_KEY = "device_uuid";
const CACHE_KEY = "cached_quota";

export interface QuotaInfo {
  used: number;
  limit: number;
  remaining: number;
  resets_at: string;
}

export interface AnalyzeResponse {
  result: MealAnalysisResult;
  quota: QuotaInfo;
}

export class QuotaExhaustedError extends Error {
  constructor(public quota: QuotaInfo) {
    super("quota_exhausted");
    this.name = "QuotaExhaustedError";
  }
}

export class AiServiceError extends Error {
  constructor() {
    super("ai_service_error");
    this.name = "AiServiceError";
  }
}

export class ProxyUnavailableError extends Error {
  constructor() {
    super("proxy_unavailable");
    this.name = "ProxyUnavailableError";
  }
}

async function getDeviceId(): Promise<string> {
  const existing = await SecureStore.getItemAsync(DEVICE_UUID_KEY);
  if (existing) return existing;

  const id = randomUUID();
  await SecureStore.setItemAsync(DEVICE_UUID_KEY, id);
  return id;
}

async function readCachedQuota(): Promise<QuotaInfo | null> {
  const raw = await SecureStore.getItemAsync(CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuotaInfo;
  } catch {
    return null;
  }
}

async function writeCachedQuota(quota: QuotaInfo): Promise<void> {
  await SecureStore.setItemAsync(CACHE_KEY, JSON.stringify(quota));
}

async function callQuotaProxy(): Promise<QuotaInfo> {
  const device_uuid = await getDeviceId();

  const res = await fetch(
    `${PROXY_BASE_URL}/quota?device_uuid=${encodeURIComponent(device_uuid)}`,
    { method: "GET" }
  );

  if (!res.ok) {
    throw new Error("failed_to_fetch_quota");
  }

  return (await res.json()) as QuotaInfo;
}

export async function getCachedQuota(): Promise<QuotaInfo | null> {
  return readCachedQuota();
}

export async function fetchQuota(): Promise<QuotaInfo> {
  const quota = await callQuotaProxy();
  await writeCachedQuota(quota);
  return quota;
}

export async function analyzeMeal(payload: {
  mode: "photo" | "text";
  image_base64?: string;
  description?: string;
  is_plus?: boolean;
}): Promise<AnalyzeResponse> {
  const device_uuid = await getDeviceId();

  const res = await fetch(`${PROXY_BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ device_uuid, ...payload }),
  });

  const body = await res.json();

  if (res.status === 429) {
    throw new QuotaExhaustedError(body.quota);
  }
  if (res.status === 502) {
    throw new AiServiceError();
  }
  if (res.status === 503) {
    throw new ProxyUnavailableError();
  }
  if (!res.ok) {
    throw new Error(body.error ?? "unknown_proxy_error");
  }

  return body as AnalyzeResponse;
}

type StoreListener = (quota: QuotaInfo) => void;

let currentQuota: QuotaInfo | null = null;
const listeners = new Set<StoreListener>();

export const QuotaStore = {
  get(): QuotaInfo | null {
    return currentQuota;
  },

  set(quota: QuotaInfo) {
    currentQuota = quota;
    listeners.forEach((fn) => {
      try {
        fn(quota);
      } catch {}
    });
  },

  subscribe(fn: StoreListener): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
