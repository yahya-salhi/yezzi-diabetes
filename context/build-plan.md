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

### 02 Dashboard Screen — Full UI

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

### 03 Add Reading Screen — Full UI

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

### 04 Add Reading — Save Logic

Wire Add Reading form to SQLite. Real data persists.

**Logic:**
- `features/glucose/services/readings.ts` — insertReading(), getReadings(), getReadingById()
- `features/glucose/types.ts` — GlucoseReading and InsertReading types
- On save: validate form → convert to mg/dL if needed → generate UUID → insert to SQLite → pop navigation
- On error: show inline error message, keep form data

**Verification:** Reading appears in SQLite after save. Navigating back and forth preserves data.

---

### 05 Dashboard Screen — Real Data

Wire dashboard to SQLite.

**Logic:**
- `features/glucose/hooks/useReadings.ts` — fetches today's readings
- `features/glucose/hooks/useAverages.ts` — fetches daily and rolling averages
- Dashboard shows today's readings as ReadingCards
- Averages show real numbers
- "Add Reading" updates dashboard on return via useFocusEffect

**Verification:** After adding a reading, dashboard shows it. After adding 2+ readings, averages calculate correctly.

---

### 06 Averages Engine

Build the averages calculation service.

**Logic:**
- `features/glucose/services/averages.ts`
- `getDailyAverage(date)` — average of all readings for given date
- `getRollingAverage(days, type?)` — average over last N days, optionally filtered by type
- Windows: daily, 7, 14, 30, 90 days
- Calculated per-type (fasting avg, post-lunch avg) and combined

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

### 07 Trend Chart

Wire 14-day trend chart.

**Logic:**
- `features/glucose/components/TrendChart.tsx`
- Fetches last 14 days of readings
- Two lines: fasting (accent color) and post-lunch (info color)
- X-axis: dates, Y-axis: glucose values
- Normal range reference band (70-140 mg/dL)

**Verification:** Chart renders with real data after multiple days of entries. Empty state shows when no data.

---

### 08 IDF Threshold + Decision Cards

Build the threshold checking and decision card system.

**Logic:**
- `features/glucose/services/thresholds.ts`
  - IDF ranges: fasting <100 normal, 100-125 pre-diabetic, >=126 high
  - Post-lunch: <140 normal, >=140 high
  - Color mapping: normal → green, borderline → orange, high → red
- `features/glucose/services/patterns.ts`
  - `detectPatterns(type)` — checks last 4 readings of same type
  - If 3+ above threshold → returns PatternAlert
  - Checks rolling 3-day average trend direction
- `features/glucose/components/DecisionCard.tsx`
  - Color-coded card with icon, title, message, optional action button
- Dashboard shows DecisionCards after each reading type section

**Verification:** Enter a high reading → red card appears with warning. Enter 3 high readings in a row → pattern alert triggers.

---

### 09 History Screen — Full UI + Logic

Build the History screen with filters and real data.

**UI:**
- Filter bar: type picker (All / Fasting / Post-Lunch), date range (Last 7 days / 14 days / 30 days / All)
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

_Planned after Feature 1 completion._

- Meal logging screen
- Food database / manual entry
- Blood sugar impact estimation
- Recommendations engine

---

## Phase 3 — Exercise Tracking

_Planned after Feature 2 completion._

- Workout logging screen
- Weekly plan builder
- Exercise library with suggestions
- Motivation and progress tracking

---

## Feature Count

| Phase                | Features |
| -------------------- | -------- |
| Phase 1 — Foundation | 9        |
| Phase 2 — Food       | TBD      |
| Phase 3 — Exercise   | TBD      |
| **Total**            | **9+**   |
