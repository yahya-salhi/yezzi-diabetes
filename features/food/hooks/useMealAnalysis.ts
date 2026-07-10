import { useState, useCallback } from "react";
import { Paths, File } from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { getApiKey, setApiKey } from "../services/apiConfig";
import { analyzeMealFromPhoto, analyzeMealFromText } from "../services/mealAnalysis";
import type { MealAnalysisResult } from "../services/mealAnalysis";

export type PhotoAnalysisResult = {
  analysis: MealAnalysisResult;
  photoPath: string;
};

type UseMealAnalysisResult = {
  analyzing: boolean;
  result: MealAnalysisResult | null;
  error: string | null;
  needsKey: boolean;
  analyzePhoto: (uri: string) => Promise<PhotoAnalysisResult | null>;
  analyzeText: (description: string) => Promise<MealAnalysisResult | null>;
  provideApiKey: (key: string) => Promise<void>;
  dismissKeyPrompt: () => void;
};

export function useMealAnalysis(): UseMealAnalysisResult {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<MealAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsKey, setNeedsKey] = useState(false);

  const ensureKey = useCallback(async (): Promise<string | null> => {
    const key = await getApiKey();
    if (!key) {
      setNeedsKey(true);
      return null;
    }
    return key;
  }, []);

  const provideApiKey = useCallback(async (key: string) => {
    await setApiKey(key);
    setNeedsKey(false);
  }, []);

  const dismissKeyPrompt = useCallback(() => {
    setNeedsKey(false);
  }, []);

  const analyzePhoto = useCallback(async (uri: string): Promise<PhotoAnalysisResult | null> => {
    const apiKey = await ensureKey();
    if (!apiKey) return null;

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const fileName = `${randomUUID()}.jpg`;
      const destFile = new File(Paths.document, fileName);
      new File(uri).move(destFile);

      const base64 = await destFile.base64();

      const analysis = await analyzeMealFromPhoto(base64, apiKey);
      setResult(analysis);
      return { analysis, photoPath: destFile.uri };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to analyze meal";
      setError(msg);
      return null;
    } finally {
      setAnalyzing(false);
    }
  }, [ensureKey]);

  const analyzeText = useCallback(async (description: string): Promise<MealAnalysisResult | null> => {
    const apiKey = await ensureKey();
    if (!apiKey) return null;

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeMealFromText(description, apiKey);
      setResult(analysis);
      return analysis;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to analyze meal";
      setError(msg);
      return null;
    } finally {
      setAnalyzing(false);
    }
  }, [ensureKey]);

  return { analyzing, result, error, needsKey, analyzePhoto, analyzeText, provideApiKey, dismissKeyPrompt };
}
