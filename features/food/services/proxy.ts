import { getDeviceId } from "./deviceId";
import type { MealAnalysisResult } from "./mealAnalysis";

const PROXY_BASE_URL = "https://ai-proxy.pcclub10.workers.dev";

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

export async function callAnalyze(payload: {
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

export async function callQuota(): Promise<QuotaInfo> {
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
