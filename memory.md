# Memory — Phase 2 Complete (Food Tracking)

Last updated: 2026-07-08

## What was built

### Feature 15 — Meal-to-Reading Linking (7f1f7d1)
- **Added `getUnlinkedMeals()` to `features/food/services/foodLog.ts`** — queries meals not yet linked to a reading, with `FoodLogRepo` interface and `createFakeFoodLog()` for testing
- **Created `features/food/hooks/useMealLinking.ts`** — orchestrates: check for unlinked meals → single-match shows MealLinkSuggestion dialog, multi-match shows picker list → calls `linkToMeal()` on accept
- **Added `linkToMeal()` to `features/glucose/GlucoseReadings.ts`** — UPDATE glucose_readings SET food_log_id — separate from insert, not modifying the add-reading flow
- **Wired `AddReadingScreen.tsx`** — after post-meal save, queries unlinked meals by meal_type + date proximity, shows linking suggestion

### Feature 16 — Meal Insights Dashboard (8fae238)
- **Created `features/food/services/impactEstimator.ts`** — `createSqliteImpactEstimator()` with `getTopSpikes(days)`:
  - JOINs linked `glucose_readings` with `food_log` WHERE `food_log_id IS NOT NULL`
  - Finds closest prior baseline (fasting/pre_meal reading same day before post_meal time)
  - Calculates actual impact = post_meal_value - baseline_value
  - Returns top 3 sorted by actual impact descending
  - Includes `createFakeImpactEstimator()` for testing
- **Created `features/food/hooks/useInsights.ts`** — standard `{data, loading, error, refresh}` pattern, calls `getTopSpikes(7)`
- **Wired `FoodDashboardScreen.tsx`** — replaced mock `SAMPLE_SPIKES` with real `useInsights()` data, enhanced row layout with meal type Badge, time, estimated vs actual comparison
- **Added `MealSpike` type to `features/food/types.ts`** — meal_id, food_name, meal_type, date, meal_time, estimated_impact, baseline_value, post_meal_value, actual_impact

### Refactoring
- **Created `features/glucose/domain/GlucoseValue.ts`** (67f7ca9) — unit-safe glucose conversion module, extracted from AddReadingScreen
- **Lifted seams to repository interfaces** (6fce885) — `FoodLogRepo` interface, adapter injection via `getDbAdapter()` default, extracted `ReadingClassifier` and threshold patterns, added `createFakeFoodLog()`

## Decisions made

- **Linking strategy**: `linkToMeal()` is a separate UPDATE on `glucose_readings`, not baked into insert — keeps meal linking optional and non-breaking
- **Matching logic**: Same-day meals matching by meal_type + time proximity (defaults: breakfast < 11:00, lunch 11:00-16:00, dinner > 16:00, snack always); single-match shows inline suggestion, multi-match shows picker
- **Impact estimation**: Actual impact = closest prior baseline (fasting/pre_meal same day before post_meal) subtracted from post_meal value; null baselines filtered out
- **Repository pattern**: All data accessors now use `getDbAdapter()` as default parameter (no caller-side db passing) + `createFake*()` factories for testability

## Problems solved

- **Mismatched progress-tracker numbering** — build-plan starts Phase 2 at 11 (Food DB Migration) while progress-tracker starts at 10. Kept progress-tracker numbering as-is for now to avoid confusion.
- **FoodLogRepo refactoring** — original `createSqliteFoodLog(db)` required callers to import `getDbAdapter()`. Refactored to accept optional `db` param, defaulting to `getDbAdapter()` internally — cleaner API with zero behavioral change.

## Current state

- **Phase 2 (Food Tracking) complete** — all 7 features done (11–17 in build-plan, 10–16 in progress-tracker)
- End-to-end food flow: capture photo → GPT-4o → review/edit → save → link to post-meal reading → see impact in insights dashboard
- GlucoseValue module extracted for unit-safe conversion
- Repository interfaces extracted for testability
- 8 total commits on `feat/phase-2-features`:
  - `849c3f7` chore(deps): add openai and expo-secure-store
  - `a7cfed6` feat(food): add GPT-4o meal analysis service and food log hooks
  - `f4682b2` feat(food): wire GPT-4o Vision into SnapMeal with ManualEntry fallback
  - `e80ae52` docs: update progress tracker, ui-registry, and session memory
  - `7f1f7d1` feat(food): add meal-to-reading linking on post-meal save
  - `67f7ca9` feat(glucose): extract GlucoseValue module for unit-safe conversion
  - `6fce885` refactor(db): lift seam from raw SQL up to repository interfaces
  - `8fae238` feat(food): add Meal Insights Dashboard with real top-spikes query

## Next session starts with

**Phase 3 — Feature 18: Reading Reminders** (build-plan line 314):
- Local notifications via expo-notifications
- Onboarding soft-ask step: "Want a nudge for your morning reading?"
- Settings section: per-type reminder toggles + time pickers
- Skip reminder when that reading type is already logged that day
- Weekly summary notification

## Open questions

- progress-tracker.md numbering is offset by -1 vs build-plan (starts Phase 2 at 10 instead of 11). Should be reconciled at some point.
