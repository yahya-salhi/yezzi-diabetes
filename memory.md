# Memory — GPT-4o Vision Integration + Save + Manual Entry

Last updated: 2026-07-08

## What was built

- **Created `features/food/services/apiConfig.ts`** — OpenAI API key get/set via `expo-secure-store`
- **Created `features/food/services/mealAnalysis.ts`** — `analyzeMealFromPhoto()` and `analyzeMealFromText()` with 2 retry attempts, JSON validation, temperature 0.3, model gpt-4o
- **Created `features/food/services/foodLog.ts`** — `createSqliteFoodLog(db)` with insert, getById, getByDate, deleteById — follows `GlucoseReadings` repo pattern
- **Created `features/food/hooks/useMealAnalysis.ts`** — orchestrates: check API key → save photo to documents dir → read base64 → call API with retries → return result
- **Created `features/food/hooks/useFoodLog.ts`** — `saveMeal()` / `getTodaysMeals()` with loading/error states
- **Created `features/food/components/MealReviewForm.tsx`** — shared review/edit form (photo, food name, nutrition fields, impact badge, meal type chips, notes, save/cancel) used by both SnapMealScreen and ManualEntryScreen
- **Created `features/food/screens/ManualEntryScreen.tsx`** — text description input → GPT-4o text analysis → same review/save flow; doubles as fallback from failed photo analysis
- **Rewired `features/food/screens/SnapMealScreen.tsx`** — replaced mock setTimeout with real `useMealAnalysis`, API key prompt modal, save to SQLite via `useFoodLog`, navigate to ManualEntry on failure
- **Updated `navigation/AppNavigator.tsx`** — added ManualEntry route to FoodStack with `{ photoUri? }` params
- **Updated `context/progress-tracker.md`** — marked features 13 (GPT-4o Vision) and 14 (Save + Manual Entry) complete
- **Updated `context/ui-registry.md`** — imprinted MealReviewForm and ApiKeyModal patterns
- **Added deps** — `openai`, `expo-secure-store`

## Decisions made

- **API key strategy**: User-provided key stored locally via `expo-secure-store` (not backend proxy). Cloudflare Workers proxy deferred to Phase 3. Key entry prompted via modal on first use in SnapMealScreen/ManualEntryScreen.
- **Photo storage**: Saved to `FileSystem.documentDirectory` using new expo-file-system File/Directory class API (SDK 57+). Only base64 sent to OpenAI — photo never uploaded elsewhere.
- **Retry strategy**: Max 2 retries on JSON parse failure only. Network/HTTP errors surface immediately with descriptive message. Retries include 500ms delay.
- **ManualEntry fallback**: Full separate screen (not inline text field) — doubles as standalone entry point for text-only meal logging.
- **MealReviewForm**: Extracted as shared component to eliminate code duplication between SnapMeal and ManualEntry screens.

## Problems solved

- **Expo-file-system SDK 57 API change** — legacy `readAsStringAsync` and `moveAsync` are deprecated at type level and throw at runtime. Must use `File`/`Directory` classes and `Paths.document` instead of `FileSystem.documentDirectory`.
- **ManualEntryScreen silent failure** — `useMealAnalysis` sets `needsKey` when no API key is present, but ManualEntryScreen didn't destructure or render it. User was stuck in a loop on the input screen. Fixed by adding the key prompt overlay matching SnapMealScreen's pattern.
- **`as never` navigation cast** — TypeScript strict mode rejects `navigation.navigate("ManualEntry" as never, ...)`. Fixed by using `(navigation as any).navigate(...)`.

## Current state

- Features 13 (GPT-4o Vision Integration) and 14 (Save Food Log + Manual Entry) complete
- End-to-end flow works: capture photo → save to docs dir → base64 → GPT-4o → review/edit → save to SQLite
- On AI failure (2 failed retries): navigates to ManualEntryScreen with photo context
- On missing API key: modal overlay prompts for key, stores via secure store
- TypeScript compiles clean (0 errors)
- 4 atomic commits on `feat/phase-2-features`:
  - `849c3f7` chore(deps): add openai and expo-secure-store
  - `a7cfed6` feat(food): add GPT-4o meal analysis service and food log hooks
  - `f4682b2` feat(food): wire GPT-4o Vision into SnapMeal with ManualEntry fallback
  - `e80ae52` docs: update progress tracker, ui-registry, and session memory

## Next session starts with

Feature 15 — Meal-to-Reading Linking (build-plan line 274):
- When user logs a post-meal reading → query today's food_log entries with matching meal_type
- If found → show MealLinkSuggestion dialog
- On accept: update glucose_readings.food_log_id
- Create `features/food/services/impactEstimator.ts`:
  - getActualImpact(readingId) — returns actual rise
  - getEstimatedVsActual(mealId) — returns estimated vs actual comparison
  - Link query: JOIN food_log ON glucose_readings.food_log_id = food_log.id

## Open questions

None.
