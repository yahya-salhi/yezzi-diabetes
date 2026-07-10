import { getDbAdapter } from "@/db/instance";
import type { DatabasePort } from "@/db/port";
import type { ReminderPreference, ReminderType } from "@/features/reminders/types";

const DEFAULTS: { id: string; reminderType: ReminderType; hour: number; minute: number }[] = [
  { id: "fasting", reminderType: "fasting", hour: 7, minute: 0 },
  { id: "pre_meal", reminderType: "pre_meal", hour: 11, minute: 0 },
  { id: "post_meal", reminderType: "post_meal", hour: 14, minute: 0 },
  { id: "bedtime", reminderType: "bedtime", hour: 21, minute: 0 },
  { id: "other", reminderType: "other", hour: 12, minute: 0 },
  { id: "weekly_summary", reminderType: "weekly_summary", hour: 9, minute: 0 },
];

export interface ReminderStorage {
  getAll(): Promise<ReminderPreference[]>;
  save(pref: Partial<ReminderPreference> & { id: string }): Promise<void>;
}

export function createSqliteReminderStorage(db?: DatabasePort): ReminderStorage {
  const adapter = db ?? getDbAdapter();

  async function ensureDefaults(): Promise<void> {
    const count = await adapter.getFirstAsync<{ c: number }>(
      "SELECT COUNT(*) as c FROM reminder_preferences",
    );
    if (count && count.c > 0) return;

    for (const d of DEFAULTS) {
      await adapter.runAsync(
        `INSERT OR IGNORE INTO reminder_preferences (id, reminder_type, enabled, hour, minute)
         VALUES (?, ?, 0, ?, ?)`,
        [d.id, d.reminderType, d.hour, d.minute],
      );
    }
  }

  function mapRow(row: any): ReminderPreference {
    return {
      id: row.id,
      reminderType: row.reminder_type as ReminderType,
      enabled: row.enabled === 1,
      hour: row.hour,
      minute: row.minute,
    };
  }

  return {
    async getAll(): Promise<ReminderPreference[]> {
      await ensureDefaults();
      const rows = await adapter.getAllAsync<any>(
        "SELECT * FROM reminder_preferences ORDER BY id",
      );
      return rows.map(mapRow);
    },

    async save(pref: Partial<ReminderPreference> & { id: string }): Promise<void> {
      const existing = await adapter.getFirstAsync<any>(
        "SELECT * FROM reminder_preferences WHERE id = ?",
        [pref.id],
      );
      if (!existing) return;

      const merged = { ...existing, ...pref };

      await adapter.runAsync(
        `UPDATE reminder_preferences SET
          enabled = ?,
          hour = ?,
          minute = ?,
          updated_at = datetime('now')
         WHERE id = ?`,
        [
          merged.enabled ? 1 : 0,
          merged.hour ?? null,
          merged.minute ?? null,
          pref.id,
        ],
      );
    },
  };
}

export function createFakeReminderStorage(): ReminderStorage {
  const store: ReminderPreference[] = DEFAULTS.map((d) => ({
    ...d,
    enabled: false,
  }));

  return {
    async getAll() {
      return [...store];
    },
    async save(pref) {
      const idx = store.findIndex((s) => s.id === pref.id);
      if (idx === -1) return;
      store[idx] = { ...store[idx], ...pref };
    },
  };
}
