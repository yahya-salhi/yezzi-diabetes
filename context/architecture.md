# Architecture

## Stack

| Layer          | Tool                          | Purpose                                |
| -------------- | ----------------------------- | -------------------------------------- |
| Framework      | Expo SDK 54 + React 19        | React Native app framework             |
| Navigation     | React Navigation 7            | Stack + bottom tab navigation          |
| Database       | expo-sqlite                   | Local on-device storage                |
| Charts         | Victory Native                | Trend charts and data visualisation    |
| Font           | Inter via @expo-google-fonts  | Primary font                           |
| Date handling  | date-fns                      | Date formatting and calculations       |
| ID generation  | uuid                          | UUID generation for database records   |
| Styling        | React Native StyleSheet       | All styling — no CSS-in-JS libraries   |
| Language       | TypeScript strict             | Throughout                             |

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
│   ├── food/              → Phase 2
│   └── exercise/          → Phase 3
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
| `features/`   | One subfolder per feature. Screens, components, services, hooks — all feature-owned.   |
| `db/`         | Database initialisation and migrations only. No business logic.                        |
| `navigation/` | Navigator setup only. No business logic.                                                |
| `theme/`      | Token constants only. No logic.                                                        |
| `components/` | Shared UI primitives only. No business logic, no feature-specific code.                |

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

| Column     | Type     | Notes                                    |
| ---------- | -------- | ---------------------------------------- |
| id         | text     | UUID, primary key                        |
| value      | real     | Stored in mg/dL internally               |
| unit       | text     | 'mg/dL' or 'mmol/L' — user's input unit  |
| type       | text     | 'fasting' or 'post_lunch'                |
| date       | text     | ISO YYYY-MM-DD                           |
| time       | text     | HH:mm                                    |
| notes      | text     | Optional user notes                      |
| created_at | text     | ISO timestamp, default current datetime  |

### Future Tables

- `food_log` — meals, carbs, estimated impact (Phase 2)
- `exercise_log` — workouts, sets, reps, weights (Phase 3)
- `user_preferences` — unit preference, target ranges

---

## Invariants

Rules the AI agent must never violate:

- No feature imports from another feature's internals. Features communicate through data only.
- All SQLite queries go through the service layer — never write SQL in components or screens.
- Every custom hook follows the `{ data, loading, error, refresh }` pattern.
- Never hardcode hex values in components — use tokens from `theme/tokens.ts`.
- All glucose values stored internally as mg/dL. Conversion happens at display time.
- Pattern detection runs after every insert, not on a timer.
- Averages are calculated from SQLite queries, not from in-memory arrays.
- Every screen has an empty state and an error state.
- DB migrations are additive only — never drop or alter existing columns.
- All dates stored as ISO strings (YYYY-MM-DD). All times stored as HH:mm.
