# Memory — Context Audit & Architecture Alignment

Last updated: 2026-07-07

## What was built

- **Circular FK removed** — dropped `reading_id` from `food_log`; only `food_log_id` on `glucose_readings` remains.
- **`user_preferences` schema defined** — single-row table (`id='default'`), unit toggle + 4 target range columns.
- **Reading types expanded** — from `fasting`/`post_lunch` to `fasting`, `pre_meal`, `post_meal`, `bedtime`, `other`. Updated all CHECK constraints, prompts, filters, and chart references across all 5 context files.
- **Onboarding flow added** — new Feature 02 in build plan (unit picker → target ranges → `user_preferences` save), renumbered all subsequent steps.
- **`@/` alias configured** — `tsconfig.json` paths + `babel.config.js` with `babel-plugin-module-resolver` installed.
- **All hex values in ui-rules.md replaced** with token references (`colors.surface`, `colors.border`, etc.).

## Decisions made

- **API key strategy**: user provides own key, stored in `expo-secure-store`, passed as param — never ships in binary. Three options documented in library-docs.md.
- **Pattern detection**: runs after every insert AND on dashboard mount (`useFocusEffect`), not on a timer.
- **`useEffect` banned for data fetching** — hooks must use `useFocusEffect`. Hook example in code-standards.md rewritten to match.
- **Calories computed** from macros via `(carbs*4)+(protein*4)+(fat*9)`, stored in `calories` column, fallback if GPT-4o returns null.
- **Workout sessions**: `type` removed from `workout_sessions` — session is just a container. Each exercise carries its own `exercise_type`. Session type derived at query time.
- **Victory Native kept** but flagged as performance risk for 90-day charts; `react-native-gifted-charts` noted as swap target.

## Problems solved

- **`process.env` in React Native** — replaced with `expo-secure-store` + parameter passing in all OpenAI examples.
- **CSV export gap** — added to out-of-scope list as high-priority future feature (simple to add, important for user trust).

## Current state

All 6 context files (`architecture.md`, `code-standards.md`, `library-docs.md`, `ui-rules.md`, `ui-tokens.md`, `build-plan.md`, `project-overview.md`) plus the spec file have been audited and aligned. No app source code has been written yet — project is pre-build phase.

## Next session starts with

Begin Phase 1 build: implement Feature 01 (Project Setup) — initialize Expo project structure, create `db/`, `theme/`, `components/ui/`, and navigation shell. Follow AGENTS.md context read order before writing any code.

## Open questions

- `react-native-gifted-charts` vs Victory Native — decision deferred until 90-day chart performance is tested.
- CSV export implementation timeline — flagged high priority but not scoped into any phase yet.
