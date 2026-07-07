# Exercise Tracking — Feature 3

## Purpose
Allow diabetic users to log both strength and cardio workouts, track progressive overload, follow weekly exercise templates, and surface insights about how exercise affects their blood glucose.

## Data Model

### `workout_sessions`

| Column     | Type     | Notes                                      |
| ---------- | -------- | ------------------------------------------ |
| id         | text     | UUID, primary key                          |
| date       | text     | ISO YYYY-MM-DD                             |
| start_time | text     | HH:mm                                      |
| end_time   | text     | HH:mm, nullable                            |
| type       | text     | 'strength' or 'cardio'                     |
| name       | text     | User-facing name ("Push Day", "Morning Run") |
| notes      | text     | Optional                                   |
| feeling    | integer  | 1-5 energy level after workout             |
| created_at | text     | ISO timestamp                              |

### `workout_exercises`

| Column        | Type     | Notes                                      |
| ------------- | -------- | ------------------------------------------ |
| id            | text     | UUID, primary key                          |
| session_id    | text     | FK to workout_sessions.id                  |
| name          | text     | "Bench Press", "Running"                   |
| exercise_type | text     | 'strength' or 'cardio'                     |
| sets          | integer  | Nullable for cardio                        |
| reps          | integer  | Nullable for cardio                        |
| weight_kg     | real     | Nullable for cardio                        |
| duration_min  | integer  | Nullable for strength                      |
| distance_km   | real     | Nullable                                   |
| heart_rate_avg| integer  | Nullable                                   |
| intensity     | text     | 'easy', 'moderate', 'hard', nullable       |
| sort_order    | integer  | Exercise order within session              |

### `workout_templates`

| Column       | Type     | Notes                             |
| ------------ | -------- | --------------------------------- |
| id           | text     | UUID, primary key                 |
| name         | text     | "Push/Pull/Legs"                  |
| days_per_week| integer  | 3, 4, 5, 6                       |
| is_active    | boolean  | Currently active template         |
| created_at   | text     | ISO timestamp                     |

### `workout_template_exercises`

| Column         | Type     | Notes                                        |
| -------------- | -------- | -------------------------------------------- |
| id             | text     | UUID, primary key                            |
| template_id    | text     | FK to workout_templates.id                   |
| day_of_week    | integer  | 0=Monday..6=Sunday                           |
| name           | text     | Exercise name                                |
| exercise_type  | text     | 'strength' or 'cardio'                       |
| target_sets    | integer  |                                              |
| target_reps    | integer  |                                              |
| last_weight_kg | real     | Last logged weight for progressive overload  |
| sort_order     | integer  |                                              |

Add to `glucose_readings`: `workout_session_id` text (nullable FK to workout_sessions.id).

## Screens

Three screens + one setup screen under the Workout tab (stack navigator):

1. **WorkoutDashboardScreen** — Weekly calendar (Mon-Sun, planned/completed/missed indicators), today's workout CTA, streak badge, weekly stats.
2. **ActiveWorkoutScreen** — Exercise list logger, expandable sets/reps/weight per exercise, cardio fields, rest timer, finish button + summary modal.
3. **WorkoutHistoryScreen** — Past sessions list, tap for session detail with exercise breakdown and progress highlight card.
4. **TemplateSetupScreen** — First-run template selection (PPL, Upper/Lower, Full Body 3x, Custom), exercise editor per day.

## Progressive Overload

- After each strength exercise, check last 2 sessions for same exercise
- If user hit target reps for all sets in 2+ consecutive sessions → suggest +2.5 kg
- Otherwise → "Hit your rep targets before increasing weight"
- Next-session preview on dashboard shows suggested weights

## Motivation System

- **Post-workout summary** — total weight lifted, comparison to last similar session
- **Streak tracking** — current streak displayed, milestone badges at 10/25/50/100 workouts
- **Periodic insights** — "Your bench press went from 45kg to 55kg in 6 weeks"

## Glucose Linking

- After finishing a workout, check for a glucose reading within 2h → suggest link
- Dashboard insight when 3+ linked pairs exist: "On workout days, your post-lunch average is X vs Y on rest days"

## Architecture

```
features/exercise/
├── screens/          → WorkoutDashboardScreen, ActiveWorkoutScreen, WorkoutHistoryScreen, TemplateSetupScreen
├── components/       → WeeklyCalendar, ExerciseCard, SetRow, ProgressHighlight, StreakBadge, WorkoutSummaryModal
├── services/         → workouts.ts, templates.ts, progressiveOverload.ts, streaks.ts, insights.ts
├── hooks/            → useWorkoutSession, useTemplates, useProgress
└── types.ts
```

DB migration: 4 new tables + `workout_session_id` column on `glucose_readings`.

New dependencies: none.

## Out of Scope (Feature 3)
- GPS route tracking / maps
- Heart rate monitor integration (BLE)
- Pre-built exercise library with instructions
- Social features / competitions
- Video exercise demonstrations
- Nutrition tracking within workouts
