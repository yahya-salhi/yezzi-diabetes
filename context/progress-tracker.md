# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 3 — Store Readiness & v1 Launch
**Last completed:** 22 YeZZi Plus — Subscription + Paywall
**Next:** 23 Compliance Pack

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
- [X] 17 Reading Reminders
- [X] 18 Logging Streak
- [X] 19 Backup & Restore
- [X] 20 CSV Export + PDF Doctor Report
- [X] 21 AI Proxy + Scan Quota
- [X] 22 YeZZi Plus — Subscription + Paywall
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
- **2026-07-15** — CSV Export + PDF Doctor Report: user picks date range (7/30/90/all) before export; CSV shares directly, PDF shows preview modal first; PDF trend as HTML table with colored bars (not chart); Plus badge on PDF row (gate deferred to paywall); EXPORT section in Settings between Backup and Data
- **2026-07-17** — AI Proxy + Scan Quota: Cloudflare Worker at ai-proxy.pcclub10.workers.dev proxies all OpenRouter calls; KV quota enforcement (10 scans/month per device UUID, calendar month UTC reset); device UUID via expo-crypto randomUUID in SecureStore; error contract: 429 (quota_exhausted), 502 (ai_service_error), 503 (proxy_unavailable); photo resized to 1024px via expo-image-manipulator before upload; ManualEntryScreen dual-path: "Analyze with AI" (quota'd) + "Skip AI" (free); FoodDashboardScreen quota indicator under date
- **2026-07-20** — RevenueCat entitlement approach: client-trusted `is_plus` flag sent in proxy request body; proxy skips quota check + KV increment when `is_plus === true`; no server-side RevenueCat validation for v1 (spoofing risk acceptable at ~$0.01/scan cost)
- **2026-07-20** — Delete-all data: wipes all SQLite tables (glucose_readings, food_log, reminder_preferences, user_preferences) + SecureStore keys (device_uuid, cached_quota); app reloads after wipe, onboarding re-shown
- **2026-07-20** — Error banner token: extracted hardcoded `#FEF2F2` to `colors.errorLight` in theme/tokens.ts
- **2026-07-21** — ADR 0002 locked YeZZi Plus subscription decisions: RevenueCat entitlement key `is_plus`; Google Play product IDs `yezzi_plus_monthly` and `yezzi_plus_yearly`; visible Settings Plus row; quota exhausted offers Upgrade + Enter manually; paywall only at natural gated moments; v1 uses client-trusted `is_plus` with server-side RevenueCat validation deferred post-launch
- **2026-07-22** — Feature 23 built: RevenueCat SDK (`react-native-purchases` v10.4.4) integrated; PlusStore observable pattern (matches QuotaStore); PaywallScreen as React Native Modal (monthly + yearly cards); `is_plus` wired into proxy calls via `useMealAnalysis`; quota indicator overridden for Plus users; ManualEntryScreen quota-exhausted offers Upgrade + Enter manually; Settings YeZZi Plus section with status/upgrade/restore; PDF export gated behind `is_plus`; data wipe logs out of RevenueCat
- **2026-07-22** — Subscription Provider Seam introduced: `subscription.ts` defines abstract `SubscriptionService` interface + service locator; `revenueCatAdapter.ts` isolates native SDK inside one adapter; `entitlement.ts` delegates to seam; `dataWipe.ts` uses seam instead of direct RevenueCat import; `App.tsx` configures via adapter; `PaywallScreen.tsx` uses abstract `SubscriptionPackage` type
- **2026-07-22** — Scanning Access Controller: `scanAccess.ts` consolidates usage limits + subscription into unified `useScanAccess()` hook; `useMealAnalysis.ts` uses `useIsPlusRef` from controller instead of `PlusStore.get()`; `FoodDashboardScreen` and `ManualEntryScreen` replaced `useQuota` + `usePlus` with single `useScanAccess()` call

---

## Notes

_Add notes here as the build progresses — workarounds, patterns, anything that differs from the context files._
