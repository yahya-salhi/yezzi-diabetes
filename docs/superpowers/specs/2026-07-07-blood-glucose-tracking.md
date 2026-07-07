# Blood Glucose Tracking — Feature 1

## Purpose
Allow diabetic users to manually log blood glucose readings (fasting morning + 2h post-lunch), view averages across configurable windows, and receive decision support based on IDF thresholds and pattern detection.

## Data Model

Table `glucose_readings` (SQLite via expo-sqlite):

| Column     | Type     | Notes                                    |
|-----------|----------|------------------------------------------|
| id        | uuid     | Primary key                              |
| value     | real     | Stored in mg/dL internally               |
| unit      | text     | 'mg/dL' or 'mmol/L' — the user's input unit |
| type      | text     | 'fasting' or 'post_lunch'                |
| date      | text     | ISO YYYY-MM-DD                           |
| time      | text     | HH:mm                                    |
| notes     | text     | Optional user notes                      |
| created_at| text     | ISO timestamp                            |

Unit conversion: `mmol/L * 18.0182 = mg/dL`. Display back in the user's preferred unit.

## Screens

Three screens in a stack navigator:

1. **DashboardScreen** — Today's readings, daily + rolling averages (7/14/30/90 days), 14-day trend chart, decision cards per reading type.
2. **AddReadingScreen** — Date, time, type toggle (fasting/post_lunch), value input with unit toggle, optional notes. Saves to SQLite.
3. **HistoryScreen** — Filterable list (by type + date range), averages per filter, pattern alerts as top cards.

## Decision Support Engine

Runs after each save and on dashboard mount (via `useFocusEffect`).

**Per-reading threshold check (IDF):**
- Fasting >= 126 mg/dL (7.0 mmol/L) → high warning
- Post-lunch >= 140 mg/dL (7.8 mmol/L) → high warning
- Color-coded card: green / yellow / red

**Pattern detection:**
- Last 4 readings of same type: if 3+ above threshold → pattern alert
- Rolling 3-day and 7-day average trend direction → trend alert
- Each alert shows actionable message

## Architecture

```
features/glucose/
├── screens/          → DashboardScreen, AddReadingScreen, HistoryScreen
├── components/       → ReadingCard, AverageCard, TrendChart, DecisionCard
├── services/         → readings.ts, averages.ts, patterns.ts, thresholds.ts
├── hooks/            → useReadings, useAverages
└── types.ts

db/                  → database.ts (init + migrations), schema.ts
components/ui/       → shared UI primitives
navigation/          → AppNavigator.tsx
```

## Out of Scope (Feature 1)
- Medication/insulin logging
- Food tracking integration (Feature 2)
- Gym/exercise tracking (Feature 3)
- Cloud sync or backup
- Push notifications
