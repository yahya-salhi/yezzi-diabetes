# Architecture

## Stack

| Layer          | Tool                          | Purpose                                |
| -------------- | ----------------------------- | -------------------------------------- |
| Framework      | Expo SDK 54 + React 19        | React Native app framework             |
| Navigation     | React Navigation 7            | Stack + bottom tab navigation          |
| Database       | expo-sqlite                   | Local on-device storage                |
| Charts         | react-native-gifted-charts     | Trend charts and data visualisation    |
| Font           | Inter via @expo-google-fonts  | Primary font                           |
| Date handling  | date-fns                      | Date formatting and calculations       |
| ID generation  | uuid                          | UUID generation for database records   |
| Styling        | React Native StyleSheet       | All styling — no CSS-in-JS libraries   |
| Language       | TypeScript strict             | Throughout                             |

### Planned — Phase 3 (Store Readiness)

| Layer          | Tool                          | Purpose                                |
| -------------- | ----------------------------- | -------------------------------------- |
| Notifications  | expo-notifications            | Local reading reminders (no push)      |
| Subscriptions  | react-native-purchases (RevenueCat) | YeZZi Plus subscription           |
| File sharing   | expo-sharing                  | Backup file + CSV export via share sheet |
| PDF            | expo-print                    | Doctor report generation               |
| AI proxy       | Cloudflare Workers            | Server-side OpenRouter calls + scan quota  |
| Analytics      | Aptabase or PostHog           | Anonymous event counts only            |

---

## Folder Structure

```
/
├── AGENTS.md
├── context/
│   ├── project-overview.md
│   ├── architecture.md
│   ├── ui-tokens.md
│   ├── ui-rules.md
│   ├── ui-registry.md
│   ├── code-standards.md
│   ├── library-docs.md
│   ├── build-plan.md
│   └── progress-tracker.md
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-07-07-blood-glucose-tracking.md
├── features/
│   ├── glucose/
│   │   ├── screens/
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── AddReadingScreen.tsx
│   │   │   └── HistoryScreen.tsx
│   │   ├── components/
│   │   │   ├── ReadingCard.tsx
│   │   │   ├── AverageCard.tsx
│   │   │   ├── TrendChart.tsx
│   │   │   └── DecisionCard.tsx
│   │   ├── services/
│   │   │   ├── readings.ts
│   │   │   ├── averages.ts
│   │   │   ├── patterns.ts
│   │   │   └── thresholds.ts
│   │   ├── hooks/
│   │   │   ├── useReadings.ts
│   │   │   └── useAverages.ts
│   │   └── types.ts
│   ├── food/
│   │   ├── screens/
│   │   │   ├── FoodDashboardScreen.tsx
│   │   │   ├── SnapMealScreen.tsx
│   │   │   ├── MealDetailScreen.tsx
│   │   │   └── ManualEntryScreen.tsx
│   │   ├── components/
│   │   │   ├── MealCard.tsx
│   │   │   ├── CameraView.tsx
│   │   │   ├── NutritionBreakdown.tsx
│   │   │   ├── EstimatedImpactBadge.tsx
│   │   │   └── MealLinkSuggestion.tsx
│   │   ├── services/
│   │   │   ├── foodLog.ts
│   │   │   ├── mealAnalysis.ts
│   │   │   └── impactEstimator.ts
│   │   ├── hooks/
│   │   │   ├── useFoodLog.ts
│   │   │   └── useMealAnalysis.ts
│   │   └── types.ts
│   ├── exercise/
│   │   ├── screens/
│   │   │   ├── WorkoutDashboardScreen.tsx
│   │   │   ├── ActiveWorkoutScreen.tsx
│   │   │   ├── WorkoutHistoryScreen.tsx
│   │   │   └── TemplateSetupScreen.tsx
│   │   ├── components/
│   │   │   ├── WeeklyCalendar.tsx
│   │   │   ├── ExerciseCard.tsx
│   │   │   ├── SetRow.tsx
│   │   │   ├── ProgressHighlight.tsx
│   │   │   ├── StreakBadge.tsx
│   │   │   └── WorkoutSummaryModal.tsx
│   │   ├── services/
│   │   │   ├── workouts.ts
│   │   │   ├── templates.ts
│   │   │   ├── progressiveOverload.ts
│   │   │   ├── streaks.ts
│   │   │   └── insights.ts
│   │   ├── hooks/
│   │   │   ├── useWorkoutSession.ts
│   │   │   ├── useTemplates.ts
│   │   │   └── useProgress.ts
│   │   └── types.ts
│   └── ...
├── db/
│   ├── database.ts        → SQLite init
│   └── migrations.ts      → Table creation
├── navigation/
│   └── AppNavigator.tsx   → Root navigator with tabs
├── theme/
│   └── tokens.ts          → Colors, spacing, typography constants
├── components/
│   └── ui/                → Shared UI primitives
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Input.tsx
│       ├── EmptyState.tsx
│       └── LoadingSpinner.tsx
├── App.tsx                → Root component, font loading, navigation
├── app.json
├── package.json
└── tsconfig.json
```

---

## System Boundaries

| Folder        | Owns                                                                                   |
| ------------- | -------------------------------------------------------------------------------------- |
| `features/` | One subfolder per feature. Screens, components, services, hooks, types — all feature-owned. |
| `db/`         | Database initialisation and migrations only. No business logic.                        |
| `navigation/` | Navigator setup only. No business logic.                                                |
| `theme/`      | Token constants only. No logic.                                                        |
| `components/` | Shared UI primitives only. No business logic, no feature-specific code.                |

---

## External Service Boundary (Phase 3)

The app has exactly one external data boundary: the AI proxy. Everything else stays on-device.

```
Meal photo (base64)
        ↓
App → POST to Cloudflare Workers proxy (with anonymous device UUID + entitlement)
        ↓
Proxy checks scan quota (free: 10/month) or Plus entitlement (unlimited)
        ↓
Proxy → GPT-4o via OpenRouter (API key lives server-side only)
        ↓
Nutrition JSON returned to app — photo processed, never stored server-side
```

- Device UUID: random, generated on first launch, no personal data
- RevenueCat entitlement distinguishes free (quota) from Plus (unlimited)
- Backup/export: local file via system share sheet — no servers hold user data

---

## Data Flow

### Manual Entry Flow

```
User taps Add Reading on Dashboard
        ↓
AddReadingScreen renders form
        ↓
User fills value, date, time, type
        ↓
Form calls readings service → insertReading()
        ↓
SQLite write
        ↓
Navigation pops back to Dashboard
        ↓
Dashboard re-renders via useFocusEffect → useReadings() re-fetches
        ↓
Averages, trend chart, decision cards all update
```

### Pattern Detection Flow

```
After insertReading() completes
        ↓
patterns.ts → detectPatterns(readingType)
        ↓
Queries last 4 readings of same type
        ↓
If 3+ above threshold → returns PatternAlert
        ↓
Dashboard renders DecisionCard with alert
```

---

## Database Schema

### `glucose_readings`

| Column      | Type     | Notes                                    |
| ----------- | -------- | ---------------------------------------- |
| id          | text     | UUID, primary key                        |
| value       | real     | Stored in mg/dL internally               |
| unit        | text     | 'mg/dL' or 'mmol/L' — user's input unit  |
| type        | text     | 'fasting', 'pre_meal', 'post_meal', 'bedtime', 'other' |
| date        | text     | ISO YYYY-MM-DD                           |
| time        | text     | HH:mm                                    |
| food_log_id        | text     | Nullable FK to food_log.id               |
| workout_session_id | text     | Nullable FK to workout_sessions.id        |
| notes              | text     | Optional user notes                      |
| created_at         | text     | ISO timestamp, default current datetime  |

### `food_log`

| Column           | Type     | Notes                                          |
| ---------------- | -------- | ---------------------------------------------- |
| id               | text     | UUID, primary key                              |
| meal_type        | text     | 'breakfast', 'lunch', 'dinner', 'snack'        |
| date             | text     | ISO YYYY-MM-DD                                 |
| time             | text     | HH:mm                                          |
| photo_uri        | text     | Local file path to captured photo              |
| food_name        | text     | GPT-4o identified food name                    |
| carbs_g          | real     | Estimated carbs in grams                       |
| protein_g        | real     | Estimated protein, nullable                    |
| fat_g            | real     | Estimated fat, nullable                        |
| calories         | real     | Computed: (carbs * 4) + (protein * 4) + (fat * 9) |
| estimated_impact | real     | GPT-4o's estimated glucose rise (mg/dL)        |
| notes            | text     | Optional user notes                            |
| created_at       | text     | ISO timestamp                                  |

### `workout_sessions`

| Column     | Type     | Notes                                      |
| ---------- | -------- | ------------------------------------------ |
| id         | text     | UUID, primary key                          |
| date       | text     | ISO YYYY-MM-DD                             |
| start_time | text     | HH:mm                                      |
| end_time   | text     | HH:mm, nullable                            |
| name       | text     | User-facing name                           |
| notes      | text     | Optional                                   |
| feeling    | integer  | 1-5 energy level                           |
| created_at | text     | ISO timestamp                              |

### `workout_exercises`

| Column         | Type     | Notes                                      |
| -------------- | -------- | ------------------------------------------ |
| id             | text     | UUID, primary key                          |
| session_id     | text     | FK to workout_sessions.id                  |
| name           | text     | Exercise name                              |
| exercise_type  | text     | 'strength' or 'cardio'                     |
| sets           | integer  | Nullable for cardio                        |
| reps           | integer  | Nullable for cardio                        |
| weight_kg      | real     | Nullable for cardio                        |
| duration_min   | integer  | Nullable for strength                      |
| distance_km    | real     | Nullable                                   |
| heart_rate_avg | integer  | Nullable                                   |
| intensity      | text     | 'easy', 'moderate', 'hard', nullable       |
| sort_order     | integer  | Exercise order within session              |

### `workout_templates`

| Column        | Type     | Notes                             |
| ------------- | -------- | --------------------------------- |
| id            | text     | UUID, primary key                 |
| name          | text     | "Push/Pull/Legs"                  |
| days_per_week | integer  | 3, 4, 5, 6                       |
| is_active     | boolean  | Currently active                  |
| created_at    | text     | ISO timestamp                     |

### `workout_template_exercises`

| Column         | Type     | Notes                                          |
| -------------- | -------- | ---------------------------------------------- |
| id             | text     | UUID, primary key                              |
| template_id    | text     | FK to workout_templates.id                     |
| day_of_week    | integer  | 0=Monday..6=Sunday                             |
| name           | text     | Exercise name                                  |
| exercise_type  | text     | 'strength' or 'cardio'                         |
| target_sets    | integer  |                                                |
| target_reps    | integer  |                                                |
| last_weight_kg | real     | For progressive overload tracking              |
| sort_order     | integer  |                                                |

### `user_preferences`

| Column              | Type     | Notes                                      |
| ------------------- | -------- | ------------------------------------------ |
| id                  | text     | `'default'` — single-row table             |
| unit                | text     | `'mg/dL'` or `'mmol/L'`                   |
| fasting_target_low  | real     | Lower bound for fasting (mg/dL)            |
| fasting_target_high | real     | Upper bound for fasting (mg/dL)            |
| postmeal_target_low | real     | Lower bound for post-meal (mg/dL)          |
| postmeal_target_high| real     | Upper bound for post-meal (mg/dL)          |
| created_at          | text     | ISO timestamp                              |
| updated_at          | text     | ISO timestamp                              |

---

## Invariants

Rules the AI agent must never violate:

- No feature imports from another feature's internals. Features communicate through data only.
- All SQLite queries go through the service layer — never write SQL in components or screens.
- Every custom hook follows the `{ data, loading, error, refresh }` pattern.
- Never hardcode hex values in components — use tokens from `theme/tokens.ts`.
- All glucose values stored internally as mg/dL. Conversion happens at display time.
- Pattern detection runs after every insert AND on dashboard mount (via `useFocusEffect`) — not on a timer.
- Averages are calculated from SQLite queries, not from in-memory arrays.
- Every screen has an empty state and an error state.
- DB migrations are additive only — never drop or alter existing columns.
- All dates stored as ISO strings (YYYY-MM-DD). All times stored as HH:mm.
- When the AI proxy is active (Phase 3), the OpenRouter API key never ships in the app binary — all AI calls go through the proxy. Until then, the user provides their own OpenRouter key stored via expo-secure-store.
- No personal data leaves the device — only meal photos (for analysis), the anonymous device UUID, purchase state, and anonymous analytics events.
- Logging is never blocked by quota or paywall — manual entry always works.
- "Delete all my data" must wipe SQLite, preferences, AsyncStorage flags, and the device UUID.
- App copy never gives medical advice — always defers to the user's care team.
