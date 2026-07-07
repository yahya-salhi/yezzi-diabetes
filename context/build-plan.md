# Build Plan

## Core Principle

Full screen UI built with mock data first — verified visually before any logic is written. Then functionality is built and wired to the screen step by step. Every feature must be visible and testable before moving to the next. No invisible backend phases.

---

## Phase 1 — Foundation

### 01 Project Setup

Initialize Expo project, install dependencies, configure navigation shell.

**Files:**

- `App.tsx` — Font loading (Inter), splash screen, root navigation container
- `navigation/AppNavigator.tsx` — Bottom tab navigator with 4 tabs (Dashboard, Food, Workout, Settings) + stack navigators per tab
- `db/database.ts` — SQLite database initialisation
- `db/migrations.ts` — glucose_readings table creation
- `theme/tokens.ts` — colors, spacing, typography constants
- `components/ui/` — Button, Card, Badge, Input, EmptyState, LoadingSpinner

**Verification:** App launches with 4 empty tab screens. No crashes. Font loaded correctly.

---

### 02 Onboarding — First-Run Setup

Build the onboarding flow that runs on first launch. Persists unit preference and optional target ranges.

**UI:**
- Step 1: Unit picker — mg/dL or mmol/L, with a visual toggle, brief explanation of each
- Step 2: Target ranges — optional step with sliders/inputs for fasting and post-meal lower/upper bounds (pre-filled with IDF defaults)
- "Get Started" button → saves to `user_preferences` and marks onboarding as complete
- Skip link on Step 2 to accept defaults and finish
- Slide-based or step-indicator layout, app-branded (logo + YeZZ heading)

**Logic:**
- `features/onboarding/services/preferences.ts` — getPreferences(), upsertPreferences()
- `features/onboarding/hooks/usePreferences.ts` — returns { unit, targets, loading, save }
- `user_preferences` table: single-row (`id='default'`), unit + 4 target columns
- On save: upsert into `user_preferences` → `AsyncStorage.setItem('onboarding_done', 'true')`
- `App.tsx` checks `onboarding_done` flag → shows onboarding stack or main tab navigator
- Default IDF thresholds: fasting 70-100 mg/dL, post-meal <140 mg/dL

**Verification:** First launch shows onboarding. After completing, main app loads. Second launch skips straight to app. Changing units in Settings updates the saved preference.

---

### 03 Dashboard Screen — Full UI

Build the complete dashboard UI with mock data. No real data yet.

**UI:**
- Today's date and greeting header
- Reading cards area — "No readings today" empty state
- Averages row — cards for daily, 7-day average with "—" placeholder
- Trend chart area — empty state with "Start logging to see your trends"
- Quick action buttons — "Add Reading" primary button, "View History" secondary

**Logic:** None. All mock data removed before next phase.

**Verification:** Dashboard renders with correct spacing, tokens, and empty states.

---

### 04 Add Reading Screen — Full UI

Build the complete Add Reading form with validation. No save logic yet.

**UI:**
- Date picker (default today)
- Time picker (default now)
- Reading type toggle — Fasting / Post-Lunch
- Value input — numeric keyboard, unit toggle button (mg/dL / mmol/L)
- Optional notes textarea
- Save button (primary, disabled until form is valid)
- Cancel button

**Validation rules:**
- Value must be a positive number
- Value range: 20-600 mg/dL (1.1-33.3 mmol/L)
- Date cannot be in the future
- Time defaults to current time

**Verification:** Form renders, validation messages show correctly, unit toggle works.

---

### 05 Add Reading — Save Logic

Wire Add Reading form to SQLite. Real data persists.

**Logic:**
- `features/glucose/services/readings.ts` — insertReading(), getReadings(), getReadingById()
- `features/glucose/types.ts` — GlucoseReading and InsertReading types
- On save: validate form → convert to mg/dL if needed → generate UUID → insert to SQLite → pop navigation
- On error: show inline error message, keep form data

**Verification:** Reading appears in SQLite after save. Navigating back and forth preserves data.

---

### 06 Dashboard Screen — Real Data

Wire dashboard to SQLite.

**Logic:**
- `features/glucose/hooks/useReadings.ts` — fetches today's readings
- `features/glucose/hooks/useAverages.ts` — fetches daily and rolling averages
- Dashboard shows today's readings as ReadingCards
- Averages show real numbers
- "Add Reading" updates dashboard on return via useFocusEffect

**Verification:** After adding a reading, dashboard shows it. After adding 2+ readings, averages calculate correctly.

---

### 07 Averages Engine

Build the averages calculation service.

**Logic:**
- `features/glucose/services/averages.ts`
- `getDailyAverage(date)` — average of all readings for given date
- `getRollingAverage(days, type?)` — average over last N days, optionally filtered by type
- Windows: daily, 7, 14, 30, 90 days
- Calculated per-type (fasting, pre_meal, post_meal, bedtime) and combined

**SQL patterns:**

```sql
-- Daily average
SELECT AVG(value) FROM glucose_readings WHERE date = ?;

-- Rolling 7-day average for fasting
SELECT AVG(value) FROM glucose_readings
WHERE date >= date('now', '-7 days') AND type = 'fasting';
```

**Verification:** Averages match manual calculation. Empty periods return null (show "—").

---

### 08 Trend Chart

Wire 14-day trend chart.

**Logic:**
- `features/glucose/components/TrendChart.tsx`
- Fetches last 14 days of readings
- Lines per type: fasting (accent color), post-meal (info color), optional others
- X-axis: dates, Y-axis: glucose values
- Normal range reference band (70-140 mg/dL)

**Verification:** Chart renders with real data after multiple days of entries. Empty state shows when no data.

---

### 09 IDF Threshold + Decision Cards

Build the threshold checking and decision card system.

**Logic:**
- `features/glucose/services/thresholds.ts`
  - IDF ranges: fasting <100 normal, 100-125 pre-diabetic, >=126 high
  - Post-meal (post_meal): <140 normal, >=140 high
  - Pre_meal shares fasting thresholds; bedtime and other use post-meal thresholds
  - Color mapping: normal → green, borderline → orange, high → red
- `features/glucose/services/patterns.ts`
  - `detectPatterns(type)` — checks last N readings of same type (4 for fasting, post_meal)
  - If 3+ above threshold → returns PatternAlert
  - Checks rolling 3-day average trend direction
- `features/glucose/components/DecisionCard.tsx`
  - Color-coded card with icon, title, message, optional action button
- Dashboard shows DecisionCards grouped by reading type section

**Verification:** Enter a high reading → red card appears with warning. Enter 3 high readings in a row → pattern alert triggers.

---

### 10 History Screen — Full UI + Logic

Build the History screen with filters and real data.

**UI:**
- Filter bar: type picker (All / Fasting / Pre-Meal / Post-Meal / Bedtime / Other), date range (Last 7 days / 14 days / 30 days / All)
- Average display per filter — shows average for current filter
- Scrollable list of ReadingCards
- Pattern alert cards at top (if any active)

**Logic:**
- `features/glucose/services/readings.ts` — getReadingsFiltered(type, startDate, endDate)
- Pattern detection runs on filtered data
- Tapping a ReadingCard → navigates to reading detail (future)

**Verification:** Filters show correct data. Averages update when filter changes. Pattern alerts persist.

---

## Phase 2 — Food Tracking

### 11 Food Database Migration

Add `food_log` table and `food_log_id` column to `glucose_readings`.

**Files:**
- `db/migrations.ts` — Add food_log table creation, add food_log_id column to glucose_readings

**Verification:** Migration runs without errors. New table queryable.

---

### 12 Food Dashboard — Full UI

Build FoodDashboardScreen with mock data. Empty states for no meals logged.

**UI:**
- Today's date header
- Meals list area — "No meals logged today" empty state
- Today's totals card — calories, carbs, estimated impact with "—" placeholders
- Quick snap FAB button (bottom-right, floating)
- Recent meals horizontal strip (placeholder empty state)
- MealLinkSuggestion component preview

**Verification:** Dashboard renders with correct spacing, tokens, empty states.

---

### 13 Snap Meal — Camera + Review UI

Build the camera screen and the review/edit screen.

**UI:**
- CameraScreen: full-screen camera preview, square crop overlay, capture button, flash toggle, close button
- ReviewScreen: captured photo thumbnail, food name input (pre-filled by AI), nutrition fields (calories, carbs, protein, fat) with edit capability, meal_type picker, estimated impact badge, notes textarea, save button
- Loading state during AI processing: skeleton card with spinner

**Verification:** Camera opens, captures photo, navigates to review screen. All UI elements present.

---

### 14 GPT-4o Vision Integration

Wire the camera to GPT-4o for food recognition.

**Logic:**
- `features/food/services/mealAnalysis.ts`
- Capture photo → save to app documents directory via expo-file-system
- Convert to base64 → POST to OpenAI GPT-4o Vision
- Parse JSON response: `{ food_name, calories, carbs_g, protein_g, fat_g, estimated_impact_mgdl }`
- On parse failure: 2 retries, then fallback to ManualEntryScreen
- `openai` package added as dependency

**Verification:** Snapping a photo of a meal returns food name and nutrition estimates. Review screen pre-fills correctly.

---

### 15 Save Food Log + Manual Entry

Wire save logic and build manual entry fallback.

**Logic:**
- `features/food/services/foodLog.ts` — insertMeal(), getMeals(), getMealById(), getMealsByDate()
- `features/food/types.ts` — FoodLog, InsertFoodLog types
- On save: validate → save to SQLite → navigate back
- ManualEntryScreen: text input for meal description → GPT-4o text-based estimation → same save flow

**Verification:** Meal saves to SQLite. Manual entry fallback works when camera fails.

---

### 16 Meal-to-Reading Linking

Wire the linking flow between food logs and glucose readings.

**Logic:**
- When user logs a post-meal reading → query today's food_log entries with matching meal_type
- If found → show MealLinkSuggestion dialog
- On accept: update glucose_readings.food_log_id
- `features/food/services/impactEstimator.ts`:
  - getActualImpact(readingId) — returns actual rise (post-meal value - fasting avg)
  - getEstimatedVsActual(mealId) — returns estimated vs actual comparison
  - Link query: JOIN food_log ON glucose_readings.food_log_id = food_log.id
- Dashboard shows linked data when available

**Verification:** After saving a meal and a post-lunch reading, linking suggestion appears. Linked meals show actual vs estimated impact.

---

### 17 Meal Insights Dashboard

Surface food pattern insights on the dashboard.

**UI:**
- "Highest Spikes This Week" — top 3 meals by actual glucose impact, shown as cards with food name, impact number, time
- Only appears when 2+ linked meal + reading pairs exist
- Currently empty state card when no data

**Logic:**
- Query last 7 days of linked meals where glucose_readings.food_log_id IS NOT NULL
- Calculate actual rise = post-meal value - pre-meal fasting baseline
- Sort descending, take top 3

**Verification:** Insights card appears after linked data exists. Shows correct sorting.

---

## Phase 3 — Exercise Tracking

### 18 Exercise Database Migration

Add 4 new tables and `workout_session_id` column to `glucose_readings`.

**Files:**
- `db/migrations.ts` — Add workout_sessions, workout_exercises, workout_templates, workout_template_exercises tables + alter glucose_readings

**Verification:** Migration runs without errors. All 4 tables queryable.

---

### 19 Template Setup — Full UI

Build the first-run template selection flow.

**UI:**
- Template selection screen: 4 options (Push/Pull/Legs, Upper/Lower, Full Body 3x, Custom) with description cards and days/week label
- Exercise editor per day: list of exercises with target sets/reps, add/remove/reorder, save
- "Start with selected template" button

**Logic:** None yet — mock data and static UI.

**Verification:** Template selection renders, day editor works with mock exercises.

---

### 20 Workout Dashboard — Full UI

Build the weekly workout dashboard.

**UI:**
- Weekly calendar (Mon-Sun) — planned days highlighted, completed days with checkmark, today emphasized
- Today's workout card — planned template exercises listed, "Start Workout" button
- Weekly stats row — sessions completed / total, total weight lifted, total cardio min (all "—" placeholder)
- Streak badge — "0-day streak" empty state
- Quick "Log Workout" button

**Verification:** Dashboard renders with empty states. Weekly calendar visual works.

---

### 21 Active Workout Logger — Full UI + Logic

Build the real-time workout logger.

**UI:**
- Top bar: workout name, elapsed timer
- Exercise list with expandable SetRows
- Strength: sets number, reps input, weight input, checkbox per set when completed
- Cardio: duration input, distance input, intensity picker, heart rate optional
- Add exercise button at bottom
- Finish Workout button → summary modal with total stats

**Logic:**
- `features/exercise/services/workouts.ts` — createSession(), addExercise(), finishSession()
- `features/exercise/types.ts` — WorkoutSession, WorkoutExercise types
- On finish: calculate total weight, duration, save to SQLite

**Verification:** Full workout can be logged and saved. Summary modal shows correct totals.

---

### 22 Progressive Overload Engine

Build auto-suggestion logic for weight increases.

**Logic:**
- `features/exercise/services/progressiveOverload.ts`
- After each logged strength set → query last 2 sessions for same exercise
- If target reps hit in 2 consecutive sessions → suggest +2.5kg
- Next session preview on dashboard: "Bench press: last 50kg x 8 — try 52.5kg if you hit all reps"

**Verification:** After logging 2 sessions with same exercise hitting target reps, overload suggestion appears on dashboard.

---

### 23 Workout History + Progress Highlights

Build history screen and motivation system.

**UI:**
- WorkoutHistoryScreen: scrollable list of past sessions with date, name, derived type (derived from exercises — strength / cardio / mixed), key stats
- Session detail: all exercises logged with sets/reps/weights
- Progress highlight card per exercise: "Bench Press: 45kg → 55kg (+22% in 6 weeks)"
- Post-workout comparison: "This is 200kg more than last Push Day!"

**Logic:**
- `features/exercise/services/workouts.ts` — getSessions(), getSessionDetail()
- `features/exercise/services/streaks.ts` — getStreak(), getMilestones()
- Progress highlights: query same exercise over time, calculate min/max trend

**Verification:** History shows past sessions. Progress highlights render with correct comparisons.

---

### 24 Workout-to-Glucose Linking + Insights

Wire linking flow and exercise-glucose insights.

**Logic:**
- After finishing a workout → check glucose_readings within 2h window → suggest link
- `features/exercise/services/insights.ts`:
  - getGlucoseOnWorkoutDays() vs getGlucoseOnRestDays()
  - getBestWorkoutTypeForFasting() — which exercise type correlates with best morning readings
- Dashboard insight card when 3+ linked pairs exist

**Verification:** Linking suggestion appears after workout. Insights card shows comparison when enough data.

---

## Feature Count

| Phase                | Features |
| -------------------- | -------- |
| Phase 1 — Foundation | 10       |
| Phase 2 — Food       | 7        |
| Phase 3 — Exercise   | 7        |
| **Total**            | **24**   |
