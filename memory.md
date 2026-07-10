# Memory — Phase 3: Reading Reminders

Last updated: 2026-07-10

## What was built

### Feature 18 — Reading Reminders
- **Installed deps**: `expo-notifications` + `@react-native-community/datetimepicker`, added both to `app.json` plugins
- **Added `reminder_preferences` table to `db/migrations.ts`** — 6 rows (fasting, pre_meal, post_meal, bedtime, other, weekly_summary), each with enabled INTEGER, hour, minute
- **Created `features/reminders/types.ts`** — `ReminderType` (5 reading types + weekly_summary), `ReminderPreference`
- **Created `features/reminders/services/reminderStorage.ts`** — `createSqliteReminderStorage` with `getAll()` (auto-seeds defaults) and `save()`; includes `createFakeReminderStorage()` for testing
- **Created `features/reminders/services/notificationScheduler.ts`** — `scheduleAll()` cancels existing + schedules daily repeating triggers; `createSkipHandler()` returns the notification handler that suppresses per-type reminders when that reading is already logged today, and restricts weekly summary to Monday only
- **Created `features/reminders/services/weeklySummary.ts`** — `getDaysInRange()` queries readings grouped by date, counts days where every reading was in range per IDF thresholds
- **Created `features/reminders/hooks/useReminderSettings.ts`** — standard `{data, loading, error, save, refresh}` pattern, auto-reschedules notifications on save
- **Created `features/reminders/hooks/useNotificationPermissions.ts`** — wraps `getPermissionsAsync`/`requestPermissionsAsync`
- **Created `features/reminders/components/NotificationPermissionOverlay.tsx`** — full-screen permission explainer (icon circle + title + message + Grant Access button + Not now link), follows CameraView permission pattern
- **Updated `App.tsx`** — `NotificationInit` component inside `RepoProvider` sets up Android notification channel, registers notification handler via `createSkipHandler()`, loads prefs and schedules all on mount
- **Updated `features/onboarding/screens/OnboardingScreen.tsx`** — Step 2 soft-ask: "Want a nudge for your morning reading?" with "Yes, remind me at 07:00" / "No, skip"; checks notification permission before saving; shows overlay if not granted
- **Updated `features/settings/screens/SettingsScreen.tsx`** — REMINDERS section with per-type Switch + tappable native time picker (DateTimePicker), weekly summary toggle; permission overlay shown on first enable
- **Updated `ui-registry.md`** — imprinted `NotificationPermissionOverlay` entry

## Decisions made

- **Skip-if-logged**: checked at notification fire time via `setNotificationHandler`, not at schedule time. Allows repeating daily triggers to work regardless of app state — the handler dynamically suppresses when a reading is already logged that calendar day
- **Weekly summary fires daily but only shows Monday**: repeating daily trigger at 09:00, handler suppresses on non-Monday. Avoids stale pre-calculated content and reschedule logic
- **Notification permission overlay**: follows CameraView permission pattern (same background, button, skip link tokens) with added icon circle. Full-width grant button (vs CameraView's centered) for mobile convention
- **All 5 reading types + weekly_summary get reminders**, not just the 3 listed in the spec (fasting/post-meal/bedtime)

## Problems solved

- **Empty reminders section** — `useReminderSettings` hook defined `refresh` but never called it on mount. Added `useEffect` to call `refresh()` on initial render
- **Type mismatch with expo-notifications** — trigger type requires `SchedulableTriggerInputTypes.DAILY` enum, not string `'daily'`. `NotificationBehavior` requires `shouldShowBanner`/`shouldShowList` instead of deprecated `shouldShowAlert`

## Current state

- **Phase 3 — Feature 18 (Reading Reminders) complete**
- All 6 reminder preferences stored in SQLite with auto-seeded defaults
- Onboarding shows soft-ask step for fasting reminder (07:00 default)
- Settings has full REMINDERS section with per-type toggles + time pickers
- Permission overlay shown on first enable (explains purpose before OS dialog)
- Weekly summary fires daily at configured time, only shows on Monday
- Per-type reminders auto-suppressed when that reading type is already logged today
- Zero TypeScript errors

## Next session starts with

**Phase 3 — Feature 19: Logging Streak** (build-plan line 331):
- Dashboard streak counter — consecutive days with ≥1 reading, milestones at 7/30/90 days
- `features/glucose/services/streaks.ts` — `getLoggingStreak()`, `getMilestones()`
- Calm presentation per design bible — no confetti, no guilt copy

## Open questions

- progress-tracker.md numbering offset remains (-1 vs build-plan). Feature 18 is #17 in progress-tracker. Should reconcile eventually.
