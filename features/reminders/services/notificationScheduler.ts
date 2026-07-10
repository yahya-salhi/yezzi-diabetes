import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import type { ReminderPreference, ReminderType } from "@/features/reminders/types";
import type { GlucoseReadings } from "@/features/glucose/GlucoseReadings";
import type { ReadingType } from "@/features/glucose/types";

const NOTIFICATION_BODIES: Record<string, string> = {
  fasting: "Time for your morning reading — log your fasting glucose.",
  pre_meal: "Pre-meal check — log your reading before eating.",
  post_meal: "Time for your post-meal reading.",
  bedtime: "Bedtime reading — one last check before sleep.",
  other: "Time for a reading — log your glucose.",
  weekly_summary: "Open YeZZ to see how this week went.",
};

function buildContent(reminderType: ReminderType): Notifications.NotificationContentInput {
  return {
    title: reminderType === "weekly_summary" ? "Your Week in Review" : "YeZZ Reading Reminder",
    body: NOTIFICATION_BODIES[reminderType],
    data: { reminderType },
    ...(reminderType !== "weekly_summary" && { sound: true }),
  };
}

export interface NotificationScheduler {
  scheduleAll(prefs: ReminderPreference[]): Promise<void>;
  cancelAll(): Promise<void>;
}

export function createNotificationScheduler(
  glucoseReadings: GlucoseReadings,
): NotificationScheduler {
  async function scheduleDaily(reminderType: ReminderType, hour: number, minute: number) {
    await Notifications.scheduleNotificationAsync({
      content: buildContent(reminderType),
      trigger: { type: SchedulableTriggerInputTypes.DAILY, hour, minute },
    });
  }

  async function scheduleWeeklySummary(hour: number, minute: number) {
    await Notifications.scheduleNotificationAsync({
      content: buildContent("weekly_summary"),
      trigger: { type: SchedulableTriggerInputTypes.DAILY, hour, minute },
    });
  }

  return {
    async cancelAll() {
      await Notifications.cancelAllScheduledNotificationsAsync();
    },

    async scheduleAll(prefs) {
      await Notifications.cancelAllScheduledNotificationsAsync();

      for (const pref of prefs) {
        if (!pref.enabled) continue;
        if (pref.hour == null || pref.minute == null) continue;

        if (pref.reminderType === "weekly_summary") {
          await scheduleWeeklySummary(pref.hour, pref.minute);
        } else {
          await scheduleDaily(pref.reminderType as ReadingType, pref.hour, pref.minute);
        }
      }
    },
  };
}

function show(): Notifications.NotificationBehavior {
  return { shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false };
}

function hide(): Notifications.NotificationBehavior {
  return { shouldShowBanner: false, shouldShowList: false, shouldPlaySound: false, shouldSetBadge: false };
}

export function createSkipHandler(glucoseReadings: GlucoseReadings) {
  return async (notification: Notifications.Notification): Promise<Notifications.NotificationBehavior> => {
    const data = notification.request.content.data;
    const reminderType = data?.reminderType as string | undefined;

    if (!reminderType) return show();

    if (reminderType === "weekly_summary") {
      const today = new Date().getDay();
      if (today !== 1) return hide();
      return show();
    }

    const todayStr = formatDate(new Date());
    const readings = await glucoseReadings.query({
      type: reminderType as ReadingType,
      date: todayStr,
    });

    if (readings.length > 0) return hide();
    return show();
  };
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
