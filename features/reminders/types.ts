export type ReminderType = "fasting" | "pre_meal" | "post_meal" | "bedtime" | "other" | "weekly_summary";

export type ReminderPreference = {
  id: string;
  reminderType: ReminderType;
  enabled: boolean;
  hour: number | null;
  minute: number | null;
};
