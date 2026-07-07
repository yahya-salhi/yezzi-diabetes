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

## Features In Scope

- Manual blood glucose entry (fasting, pre_meal, post_meal, bedtime, other)
- Support for mg/dL and mmol/L with conversion
- IDF threshold-based reading assessment
- Rolling averages: daily, 7, 14, 30, 90 days
- Trend chart (14-day)
- Pattern detection (3+ consecutive high readings)
- Decision cards with color-coded feedback
- Reading history with filters and date range
- Food log with photo capture and GPT-4o Vision food recognition
- Estimated nutrition (carbs, protein, fat) per meal
- Estimated blood glucose impact per meal
- Meal-to-reading linking for actual vs estimated comparison
- Meal insights dashboard (highest spike meals)
- Workout logging (strength + cardio)
- Weekly exercise templates with progressive overload
- Workout-to-glucose linking and insights
- Streak tracking and milestone badges
- On-device storage — no sign-up required

---

## Features Out of Scope

- Cloud sync or backup
- Data export (CSV) — **high priority for a follow-up**, simple to add but deferred from initial builds
- User accounts or authentication
- Medication/insulin logging
- Bluetooth glucometer integration
- Apple Health / Google Fit integration
- Push notifications
- Doctor/healthcare provider sharing
- IoT or wearable device integration
- Multi-language support
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
