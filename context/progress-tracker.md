# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Foundation
**Last completed:** Feature 2 spec written and committed
**Next:** 01 Project Setup

---

## Progress

### Phase 1 — Foundation

- [X] Spec: Blood Glucose Tracking Design Doc
- [X] Spec: Food Tracking Design Doc
- [ ] 01 Project Setup
- [ ] 02 Dashboard Screen — Full UI
- [ ] 03 Add Reading Screen — Full UI
- [ ] 04 Add Reading — Save Logic
- [ ] 05 Dashboard Screen — Real Data
- [ ] 06 Averages Engine
- [ ] 07 Trend Chart
- [ ] 08 IDF Threshold + Decision Cards
- [ ] 09 History Screen — Full UI + Logic

### Phase 2 — Food Tracking

- [ ] 10 Food Database Migration
- [ ] 11 Food Dashboard — Full UI
- [ ] 12 Snap Meal — Camera + Review UI
- [ ] 13 GPT-4o Vision Integration
- [ ] 14 Save Food Log + Manual Entry
- [ ] 15 Meal-to-Reading Linking
- [ ] 16 Meal Insights Dashboard

### Phase 3 — Exercise Tracking

- [ ] Spec: Exercise Tracking Design Doc
- [ ] _Implementation features_

---

## Decisions Made During Build

- **2026-07-07** — IDF thresholds adopted for reading classification (fasting <100 normal, 100-125 pre-diabetic, >=126 high)
- **2026-07-07** — mg/dL as internal storage unit, mmol/L supported for input/display with * 18.0182 conversion
- **2026-07-07** — expo-sqlite for local storage, no cloud or account needed
- **2026-07-07** — Approach B (feature-sliced) adopted for folder structure
- **2026-07-07** — Stack navigator selected for sub-screens, bottom tabs for main sections
- **2026-07-07** — GPT-4o Vision for food recognition + nutrition estimation
- **2026-07-07** — Photo saved locally, only base64 sent to OpenAI API
- **2026-07-07** — Meals linked to glucose readings for actual vs estimated impact comparison

---

## Notes

_Add notes here as the build progresses — workarounds, patterns, anything that differs from the context files._
