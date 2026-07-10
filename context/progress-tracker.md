# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 2 — Food Tracking
**Last completed:** 16 Meal Insights Dashboard
**Next:** 17 Reading Reminders (Phase 3)

**Roadmap re-prioritized 2026-07-08** per store-readiness spec: new Phase 3 (Store Readiness & v1 Launch) inserted before exercise; exercise moved to Phase 4 (v1.1, post-launch).

---

## Progress

### Phase 1 — Foundation

- [X] Spec: Blood Glucose Tracking Design Doc
- [X] Spec: Food Tracking Design Doc
- [X] Spec: Exercise Tracking Design Doc
- [X] 01 Project Setup
- [X] 02 Onboarding — First-Run Setup
- [X] 03 Dashboard Screen — Full UI
- [X] 04 Add Reading Screen — Full UI
- [X] 05 Add Reading — Save Logic
- [X] 06 Dashboard Screen — Real Data
- [X] 07 Averages Engine
- [X] 08 Trend Chart
- [X] 09 IDF Threshold + Decision Cards
- [X] 10 History Screen — Full UI + Logic

### Phase 2 — Food Tracking

- [X] 10 Food Database Migration
- [X] 11 Food Dashboard — Full UI
- [X] 12 Snap Meal — Camera + Review UI
- [X] 13 GPT-4o Vision Integration
- [X] 14 Save Food Log + Manual Entry
- [X] 15 Meal-to-Reading Linking
- [X] 16 Meal Insights Dashboard

### Phase 3 — Store Readiness & v1 Launch

- [X] Spec: Store Readiness & Growth Design Doc
- [ ] 17 Reading Reminders
- [ ] 18 Logging Streak
- [ ] 19 Backup & Restore
- [ ] 20 CSV Export + PDF Doctor Report
- [ ] 21 AI Proxy + Scan Quota
- [ ] 22 YeZZi Plus — Subscription + Paywall
- [ ] 23 Compliance Pack
- [ ] 24 Store Listing + Launch

### Phase 4 — Exercise Tracking (v1.1 — post-launch)

- [ ] 25 Exercise Database Migration
- [ ] 26 Template Setup — Full UI
- [ ] 27 Workout Dashboard — Full UI
- [ ] 28 Active Workout Logger — Full UI + Logic
- [ ] 29 Progressive Overload Engine
- [ ] 30 Workout History + Progress Highlights
- [ ] 31 Workout-to-Glucose Linking + Insights

---

## Decisions Made During Build

- **2026-07-07** — IDF thresholds adopted for reading classification (fasting <100 normal, 100-125 pre-diabetic, >=126 high)
- **2026-07-07** — Swapped Victory Native for react-native-gifted-charts due to peer dependency conflict with RN 0.81.5
- **2026-07-07** — mg/dL as internal storage unit, mmol/L supported for input/display with * 18.0182 conversion
- **2026-07-07** — expo-sqlite for local storage, no cloud or account needed
- **2026-07-07** — Approach B (feature-sliced) adopted for folder structure
- **2026-07-07** — Stack navigator selected for sub-screens, bottom tabs for main sections
- **2026-07-07** — GPT-4o Vision for food recognition + nutrition estimation
- **2026-07-07** — Photo saved locally, only base64 sent to GPT-4o via OpenRouter API
- **2026-07-07** — Meals linked to glucose readings for actual vs estimated impact comparison
- **2026-07-07** — Progressive overload with +2.5kg suggestions when rep targets hit for 2+ consecutive sessions
- **2026-07-07** — Exercise templates: Push/Pull/Legs, Upper/Lower, Full Body 3x, Custom
- **2026-07-07** — Workout linked to glucose readings (same pattern as meals)
- **2026-07-07** — Cardio tracking: duration, distance, intensity, optional heart rate
- **2026-07-07** — Motivation via post-workout comparisons, streak tracking, milestone badges
- **2026-07-08** — Freemium model: core tracking free forever; 10 free AI scans/month; YeZZi Plus ($2.99/mo, $19.99/yr) for unlimited scans + PDF reports
- **2026-07-08** — Google Play first, App Store fast follow (v1.2)
- **2026-07-08** — Lean v1: glucose + food AI + growth essentials; exercise deferred to v1.1
- **2026-07-08** — Approach A infrastructure: no accounts, local file backup, Cloudflare Workers AI proxy (key never in binary), RevenueCat, local notifications
- **2026-07-08** — Health Connect → v1.1 (Android), Apple Health → v1.2 (iOS)
- **2026-07-10** — Switched from direct OpenAI to OpenRouter for GPT-4o; user provides OpenRouter API key (`sk-or-v1-...`); same `openai` npm package with `baseURL: https://openrouter.ai/api/v1`; model changed to `openai/gpt-4o`
- **2026-07-08** — API key strategy: user-provided OpenAI key stored via expo-secure-store; Cloudflare Workers proxy deferred to Phase 3
- **2026-07-08** — Photo saved to FileSystem.documentDirectory via new expo-file-system File/Directory API (SDK 57+)
- **2026-07-08** — MealReviewForm extracted as shared component between SnapMealScreen and ManualEntryScreen
- **2026-07-08** — Meal-to-Reading Linking: separate `linkToMeal()` on GlucoseReadings (UPDATE, not modifying insert); `useMealLinking` hook orchestrates query + link; matching by time proximity on same day; single-meal shows MealLinkSuggestion dialog, multi-meal shows picker list
- **2026-07-08** — Impact estimation: actual = closest prior baseline (fasting/pre_meal same day) subtracted from post_meal value; null baselines filtered out; `getTopSpikes()` returns top 3 descending
- **2026-07-08** — Repository pattern: all data accessors use `getDbAdapter()` as default param + `createFake*()` factories for testability

---

## Notes

_Add notes here as the build progresses — workarounds, patterns, anything that differs from the context files._
