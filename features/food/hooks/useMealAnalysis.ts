import { useState, useCallback } from "react";
import { Paths, File } from "expo-file-system";
import { randomUUID } from "expo-crypto";
import * as ImageManipulator from "expo-image-manipulator";
import { callAnalyze } from "../services/proxy";
import {
  QuotaExhaustedError,
  AiServiceError,
  ProxyUnavailableError,
} from "../services/proxy";
import type { MealAnalysisResult } from "../services/mealAnalysis";
import type { QuotaInfo } from "../services/proxy";

export type PhotoAnalysisResult = {
  analysis: MealAnalysisResult;
  photoPath: string;
};

export type ProxyError =
  | { type: "quota_exhausted"; quota: QuotaInfo }
  | { type: "ai_service_error" }
  | { type: "proxy_unavailable" }
  | { type: "unknown"; message: string };

type UseMealAnalysisResult = {
  analyzing: boolean;
  result: MealAnalysisResult | null;
  error: ProxyError | null;
  analyzePhoto: (uri: string) => Promise<PhotoAnalysisResult | null>;
  analyzeText: (description: string) => Promise<MealAnalysisResult | null>;
};

export function useMealAnalysis(): UseMealAnalysisResult {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<MealAnalysisResult | null>(null);
  const [error, setError] = useState<ProxyError | null>(null);

  const analyzePhoto = useCallback(
    async (uri: string): Promise<PhotoAnalysisResult | null> => {
      setAnalyzing(true);
      setError(null);
      setResult(null);

      try {
        const manipulated = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 1024 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        const fileName = `${randomUUID()}.jpg`;
        const destFile = new File(Paths.document, fileName);
        new File(manipulated.uri).move(destFile);

        const base64 = await destFile.base64();
        const response = await callAnalyze({ mode: "photo", image_base64: base64 });

        setResult(response.result);
        return { analysis: response.result, photoPath: destFile.uri };
      } catch (err) {
        setError(classifyError(err));
        return null;
      } finally {
        setAnalyzing(false);
      }
    },
    []
  );

  const analyzeText = useCallback(
    async (description: string): Promise<MealAnalysisResult | null> => {
      setAnalyzing(true);
      setError(null);
      setResult(null);

      try {
        const response = await callAnalyze({ mode: "text", description });
        setResult(response.result);
        return response.result;
      } catch (err) {
        setError(classifyError(err));
        return null;
      } finally {
        setAnalyzing(false);
      }
    },
    []
  );

  return { analyzing, result, error, analyzePhoto, analyzeText };
}

function classifyError(err: unknown): ProxyError {
  if (err instanceof QuotaExhaustedError) {
    return { type: "quota_exhausted", quota: err.quota };
  }
  if (err instanceof AiServiceError) {
    return { type: "ai_service_error" };
  }
  if (err instanceof ProxyUnavailableError) {
    return { type: "proxy_unavailable" };
  }
  const message = err instanceof Error ? err.message : "Failed to analyze meal";
  return { type: "unknown", message };
}
