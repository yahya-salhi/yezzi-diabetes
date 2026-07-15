# Memory — Phase 3: Backup & Restore

Last updated: 2026-07-15

## What was built

### Feature 20 — Backup & Restore
- **Created `features/settings/services/backup.ts`** — `createBackup()` serializes all 4 tables to versioned JSON; `saveBackupFile()` writes to document dir via expo-file-system v19 API (`Paths.document`, `new File()`) then shares via expo-sharing; `updateLastBackupTimestamp()` marks backup time in user_preferences
- **Typed all row types** — `GlucoseReading`, `FoodLog`, `UserPreference`, `ReminderPreference` derived from migration schema; zero `any` usage
- **Fixed expo-file-system v19 migration** — replaced deprecated `FileSystem.documentDirectory` + `writeAsStringAsync` with `Paths.document` + `new File().write()`

## Decisions made

- **expo-file-system v19 API** — uses `Paths.document` and `new File().write()` instead of legacy `documentDirectory` + `writeAsStringAsync`
- **Row types exported from backup.ts** — local types, not shared (only used here for backup serialization)

## Problems solved

- **expo-file-system v19 breaking changes** — `documentDirectory` and `EncodingType` no longer exist at top level; migrated to class-based API

## Current state

- **Phase 3 — Features 15–20 complete** (Onboarding, AI Photo, Food DB, Reading Reminders, Logging Streak, Backup & Restore)
- Branch: `feat/backup-restore`
- Zero TypeScript errors, lint passes

## Next session starts with

**Phase 3 — Feature 21** (check build-plan for next item)
