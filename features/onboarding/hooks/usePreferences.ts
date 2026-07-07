import { useState, useCallback } from "react";
import type { UserPreferences } from "../services/preferences";
import { getPreferences, upsertPreferences } from "../services/preferences";

type UsePreferencesResult = {
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
  save: (prefs: Partial<UserPreferences>) => Promise<void>;
  refresh: () => Promise<void>;
};

export function usePreferences(): UsePreferencesResult {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPreferences();
      setPreferences(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (prefs: Partial<UserPreferences>) => {
    try {
      setLoading(true);
      setError(null);
      await upsertPreferences(prefs);
      await refresh();
    } catch (err) {
      setError(String(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  return { preferences, loading, error, save, refresh };
}
