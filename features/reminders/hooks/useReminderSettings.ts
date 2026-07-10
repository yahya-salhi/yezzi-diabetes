import { useState, useCallback, useEffect } from "react";
import { createSqliteReminderStorage } from "@/features/reminders/services/reminderStorage";
import { createNotificationScheduler } from "@/features/reminders/services/notificationScheduler";
import { useGlucoseReadings } from "@/features/repos/RepoContext";
import type { ReminderPreference } from "@/features/reminders/types";

type UseReminderSettingsResult = {
  preferences: ReminderPreference[];
  loading: boolean;
  error: string | null;
  save: (pref: Partial<ReminderPreference> & { id: string }) => Promise<void>;
  refresh: () => Promise<void>;
};

export function useReminderSettings(): UseReminderSettingsResult {
  const [preferences, setPreferences] = useState<ReminderPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const glucoseReadings = useGlucoseReadings();

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const storage = createSqliteReminderStorage();
      const data = await storage.getAll();
      setPreferences(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(
    async (pref: Partial<ReminderPreference> & { id: string }) => {
      try {
        setLoading(true);
        setError(null);
        const storage = createSqliteReminderStorage();
        await storage.save(pref);
        const all = await storage.getAll();
        setPreferences(all);

        const scheduler = createNotificationScheduler(glucoseReadings);
        await scheduler.scheduleAll(all);
      } catch (err) {
        setError(String(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [glucoseReadings],
  );

  return { preferences, loading, error, save, refresh };
}
