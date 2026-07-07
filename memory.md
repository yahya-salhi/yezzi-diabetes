# Memory — Database Port / Adapter Seam

Last updated: 2026-07-07

## What was built

- **Created `db/port.ts`** — `DatabasePort` interface (`getAllAsync`, `getFirstAsync`, `runAsync`, `execAsync`)
- **Created `db/sqlite-adapter.ts`** — SQLite adapter wrapping `getDb()`, implements `DatabasePort`
- **Created `db/memory-adapter.ts`** — In-memory adapter implementing `DatabasePort` for tests (basic SQL parsing: WHERE, ORDER BY, LIMIT, INSERT)
- **Created `db/instance.ts`** — Singleton holder with `initDb(adapter)` / `getDbAdapter()`; lazily creates SQLite adapter by default
- **Refactored `features/glucose/GlucoseReadings.ts`** — `createSqliteGlucoseReadings(db: DatabasePort)` instead of calling `getDb()` internally
- **Refactored `features/onboarding/services/preferences.ts`** — `getPreferences(db)`, `upsertPreferences(db, prefs)` take `DatabasePort` parameter
- **Updated all 4 glucose hooks** (`useReadings`, `useAverages`, `useTrends`, `usePatterns`) — pass `getDbAdapter()` to repo factory
- **Updated `features/glucose/screens/AddReadingScreen.tsx`** — uses `getDbAdapter()`
- **Updated `features/onboarding/hooks/usePreferences.ts`** — passes `getDbAdapter()` to service functions
- **Updated `App.tsx`** — uses `getDbAdapter()` instead of `getDb()`
- **Cleaned `features/glucose/components/ReadingCard.tsx`** — removed unnecessary `as any` cast on `reading.type`

## Decisions made

- `DatabasePort` interface mirrors `expo-sqlite` API methods rather than introducing a different abstraction — minimal port surface, trivial to implement
- Singleton holder at `db/instance.ts` with lazy init — no DI framework needed; `initDb(adapter)` allows test injection, by default lazily creates SQLite adapter
- Memory adapter uses basic SQL pattern matching (not a full parser) — sufficient for the existing query patterns in `GlucoseReadings` and `preferences.ts`
- `getPreferences()` and `upsertPreferences()` now take `db` as first parameter instead of calling `getDb()` internally — explicit dependency injection at the function level
- `runAsync` return type set to `void` in the port — existing code doesn't use `lastInsertRowId` or `changes`

## Problems solved

- Every service was calling `getDb()` directly — no seam between business logic and the database
- `GlucoseReadings` and `preferences.ts` had hard compile-time dependency on `expo-sqlite` — tests required real SQLite
- `ReadingCard.tsx` had `as any` cast on `reading.type` — unnecessary since `GlucoseReading.type` is already `ReadingType`
- `App.tsx` called `await getDb()` explicitly at startup — adapter now opens DB lazily on first query

## Current state

- All services depend on `DatabasePort` interface — `getDb()` call isolated to `db/sqlite-adapter.ts`
- `createFakeGlucoseReadings()` in `GlucoseReadings.ts` still exists as a higher-level test helper (feature-specific mock)
- TypeScript compiles clean (`tsc --noEmit` passes)
- `getDb()` in `db/database.ts` still exists — only imported by `db/sqlite-adapter.ts`
- No tests written yet — seam is ready for test injection

## Next session starts with

Write tests using `initDb(createMemoryDb())` to verify service behavior — start with `GlucoseReadings` query/insert, then `preferences.ts` get/upsert.

## Open questions

None.
