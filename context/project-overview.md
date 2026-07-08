# Project Overview

## About the Project

YeZZ is a mobile-first diabetes management companion built with Expo React Native. It helps diabetic users track their blood glucose readings, log meals and estimate their impact on blood sugar, and manage exercise routines tailored to their condition. The app is designed to be used daily — morning fasting readings, post-meal checks, food logging, and workout tracking all in one place.

---

## The Problem It Solves

Managing diabetes requires constant vigilance across multiple dimensions: blood sugar levels, food choices, and physical activity. Most people use separate tools — a glucose log, a food diary, a fitness tracker — and piece together the picture themselves. YeZZ brings all three into one app, with decision support that connects the dots: high post-meal glucose? Here's what you ate. Consistently high fasting readings? Here's the trend and what to try.

---

## Screens

```
(dashboard)    → Home — today's readings, averages, alerts, quick actions
/add-reading   → Manual blood glucose entry
/history       → Past readings with filters and pattern alerts
/food          → Food log — meals, impact estimation, recommendations
/exercise      → Workout tracking, weekly plan, exercise library
/settings      → Profile, unit preferences, thresholds
```

---

## Navigation

Bottom tab bar with four tabs: Dashboard, Food, Workout, Settings. Stack navigator within each tab for sub-screens.

---

## Core User Flow

### Daily Routine

- Morning: user opens app → logs fasting blood glucose → sees yesterday's trend → quick glance at today's food plan
- Post-lunch: user logs 2h post-meal reading → app compares with food log → provides feedback
- Evening: user logs dinner and any exercise → views daily summary

### First Time Setup

- User downloads and opens app
- Sets preferred unit (mg/dL or mmol/L)
- Optionally sets personal target ranges
- Starts logging — no account required, all data stays on device

### Blood Glucose Tracking

- Manual entry with date, time, type (fasting / pre_meal / post_meal / bedtime / other), value, unit toggle, optional notes
- Dashboard shows today's readings, daily/weekly/14/30/90 day averages
- Color-coded decision cards per reading based on IDF thresholds
- Pattern detection: 3+ high readings of same type triggers pattern alert

### Food Logging (Feature 2 — active)

- Snap a photo of the meal → GPT-4o Vision identifies food and estimates nutrition (carbs, protein, fat) + blood glucose impact
- Manual text entry fallback when camera is unavailable
- Link meals to post-lunch glucose readings for actual vs estimated impact comparison
- Meal insights dashboard: "Highest Spikes This Week" shows meals with biggest actual impact
- Per-meal feedback on estimated glucose rise

### Exercise Tracking (Feature 3 — active)

- Log strength (sets, reps, weight) and cardio (duration, distance, intensity) workouts
- Weekly exercise templates (PPL, Upper/Lower, Full Body 3x, Custom)
- Progressive overload suggestions (+2.5kg when rep targets hit)
- Link workouts to glucose readings for exercise-vs-glucose insights
- Post-workout summaries, streak tracking, milestone badges
- Periodic progress highlights

---

## Data Architecture

### Local Storage (SQLite via expo-sqlite)

All data lives on-device. No cloud sync, no account required. The database holds:

- `glucose_readings` — blood glucose log entries
- `food_log` — meal entries (planned)
- `exercise_log` — workout entries (planned)
- `user_preferences` — unit preferences, target ranges

---

## Release Plan

Per `docs/superpowers/specs/2026-07-08-store-readiness-design.md`:

- **v1 (Google Play):** glucose tracking + AI food log + reminders + backup/export + freemium (YeZZi Plus)
- **v1.1 (4–6 weeks post-launch):** exercise module + Health Connect (Android)
- **v1.2 (~2–3 months):** App Store launch + Apple Health; multi-language candidate (French + Arabic)
- **v2 (with traction):** optional encrypted cloud backup, widgets, CGM exploration

**Monetization:** core tracking free forever. 10 free AI scans/month; YeZZi Plus subscription ($2.99/month, $19.99/year) unlocks unlimited scans + PDF doctor reports. AI calls go through an anonymous API proxy — no accounts, no personal data server-side.

---

## Features In Scope — v1

- Manual blood glucose entry (fasting, pre_meal, post_meal, bedtime, other)
- Support for mg/dL and mmol/L with conversion
- IDF threshold-based reading assessment
- Rolling averages: daily, 7, 14, 30, 90 days
- Trend chart (14-day)
- Pattern detection (3+ consecutive high readings)
- Decision cards with color-coded feedback
- Reading history with filters and date range
- Food log with photo capture and GPT-4o Vision food recognition (via API proxy, quota'd)
- Estimated nutrition (carbs, protein, fat) per meal
- Estimated blood glucose impact per meal
- Meal-to-reading linking for actual vs estimated comparison
- Meal insights dashboard (highest spike meals)
- Reading reminders (local notifications, skip-when-logged)
- Logging streak with 7/30/90-day milestones
- Backup/restore to a local file via share sheet
- CSV export (free) + PDF doctor report (Plus)
- YeZZi Plus subscription via RevenueCat
- Medical disclaimer, privacy policy, delete-all-data
- On-device storage — no sign-up required

## Features In Scope — v1.1 (post-launch)

- Workout logging (strength + cardio)
- Weekly exercise templates with progressive overload
- Workout-to-glucose linking and insights
- Workout streak tracking and milestone badges
- Health Connect integration (Android)

---

## Features Out of Scope

- Cloud sync or automatic cloud backup — v2 candidate (encrypted, optional)
- User accounts or authentication — anonymous device ID only
- Medication/insulin logging — regulatory risk, stays out
- Bluetooth glucometer / CGM integration
- Apple Health — arrives with the App Store launch (v1.2)
- Doctor/healthcare provider sharing beyond PDF export
- IoT or wearable device integration
- Multi-language support — v1.2 candidate (French + Arabic first)
- Social features or communities

---

## Target User

A person with Type 1 or Type 2 diabetes who:
- Checks their blood glucose at least twice daily
- Wants to understand how food affects their levels
- Uses exercise as part of their management plan
- Prefers a simple, no-account mobile app
- Wants data-driven insights without complexity

---

## Success Criteria

- User can log a fasting reading in under 10 seconds
- User can log a post-lunch reading in under 10 seconds
- Averages update instantly after each entry
- IDF thresholds correctly classify readings as normal or high
- Pattern detection catches 3+ consecutive high readings
- Trend chart renders correctly with 14 days of data
- All data persists across app restarts
- App never crashes on any screen
- UI adapts correctly to both mg/dL and mmol/L units
