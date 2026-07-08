# Store Readiness & Growth — Product Design

Decisions locked 2026-07-08 through brainstorming. Goal: maximize downloads and
retention for a first store release. This spec re-prioritizes the roadmap; it does
not change the feature specs for glucose, food, or exercise tracking.

## Locked Decisions

| Decision | Choice |
| -------- | ------ |
| Goal | Maximize downloads/retention; re-prioritize around growth features |
| Monetization | Freemium — core tracking free forever; AI scans quota'd; "YeZZi Plus" subscription |
| Store strategy | Google Play first; App Store fast follow (~4–8 weeks later) |
| v1 scope | Lean: glucose + food AI + reminders + backup/export. Exercise → v1.1 |
| Infrastructure | Approach A — minimal, privacy-first. No accounts, no cloud data storage |

## Positioning

> "The private diabetes companion. Log glucose in seconds, snap your meals to see
> their impact — no account, your data never leaves your device."

Two differentiators: AI meal scanning (the wow feature) and radical privacy
(no sign-up, on-device data). Product rule: YeZZi is a companion, never gives
medical advice. All copy defers to the user's care team. Never "diagnosis",
"treatment", or "medical advice" anywhere — app or store listing.

## v1 Scope

| Area | Content |
| ---- | ------- |
| Glucose (done) | Logging, averages, trend chart, IDF decision cards, history, pattern alerts |
| Food (finish Phase 2) | GPT-4o Vision scan, save + manual entry, meal-to-reading linking, spike insights |
| Retention layer (new) | Reading reminders (fasting/post-meal/bedtime, configurable), logging streak |
| Trust layer (new) | One-tap backup/restore file, CSV export (free), PDF doctor report (Plus) |
| Monetization (new) | 10 free AI scans/month → YeZZi Plus for unlimited |
| Compliance (new) | Medical disclaimer, privacy policy, Play data-safety declarations, delete-all-data |

Cut from v1: exercise module (v1.1), Health Connect (v1.1), cloud sync (v2),
medication logging (out — regulatory risk), multi-language (v1.2 candidate:
French + Arabic).

## Retention Mechanics

- **Reminders:** local notifications via expo-notifications. Configured during
  onboarding with a soft ask. Skipped when that reading type is already logged
  that day. Weekly summary notification with positive framing only.
- **Streak:** consecutive days with ≥1 reading, shown on dashboard. Milestones at
  7/30/90 days. Calm presentation per design bible — no confetti, no guilt.

## Monetization Mechanics

- **Free tier:** 10 AI scans/month, resets monthly. Remaining count shown quietly
  on the Food screen. Manual meal entry always available — logging is never blocked.
- **YeZZi Plus:** launch prices $2.99/month and $19.99/year (Play Console local
  price equivalents; revisit after first-month conversion data). Unlimited scans +
  PDF doctor reports + future premium insights.
- **Paywall placement:** only at natural moments (quota exhausted, PDF export).
  Never a launch interstitial.
- **Payments:** RevenueCat SDK for Google Play subscriptions. No custom backend.

## Infrastructure (Approach A)

- **API proxy:** single endpoint on Cloudflare Workers free tier. Receives meal
  photo → checks anonymous device quota → forwards to OpenAI with the app's key →
  returns nutrition estimate. Photos are processed, never stored server-side.
- **Device identity:** random UUID generated on first launch. No personal data.
- **Entitlements:** RevenueCat entitlement distinguishes subscriber (unlimited)
  from free (quota) at the proxy.
- **Backup/export:** Settings → "Back up my data" produces one JSON file, shared
  via system share sheet; "Restore from backup" imports it. Gentle reminder card
  after 30 days of data with no backup. CSV export free; formatted PDF (charts +
  averages) is Plus.
- **Analytics:** anonymous, privacy-respecting tool (PostHog or Aptabase free
  tier). Event counts only, declared in the data-safety form.

## Store Compliance (Google Play)

- Health apps declaration: wellness/tracking app, not a medical device.
- Privacy policy at a public URL (GitHub Pages). Honest one-liner: data stays
  on-device; meal photos sent only for analysis, not stored.
- Data safety form declares: meal photos (processed, not stored), anonymous
  device ID, purchase state, anonymous analytics events. Nothing else.
- In-app medical disclaimer: shown once at onboarding, always in Settings.
  "YeZZi is not a medical device. Never change treatment without consulting
  your care team."
- "Delete all my data" button in Settings (no accounts, so this covers the
  data-deletion requirement).

## Store Listing

- Screenshots from the 6-screen premium design set (see
  `context/screen-design-bible.md`) with short benefit captions.
- Title: "YeZZi — Diabetes & Glucose Tracker". Description leads with privacy +
  AI scanning.
- Feature graphic + icon consistent with the teal/warm design bible.

## Launch Sequence

1. Internal testing track — developer + friends/family, 1–2 weeks, real devices.
2. Closed beta — 15–30 testers, recruited from diabetes communities.
3. Production with staged rollout: 10% → 50% → 100%, watching crash rate between
   stages.
4. Pre-launch verification: subscription purchase/cancel with license testers,
   quota reset, backup/restore round-trip.

## Post-Launch Roadmap

- **v1.1 (4–6 weeks post-launch):** exercise module (Phase 3 as specced), Health
  Connect (Android) — read steps/workouts, write glucose — plus beta/launch fixes.
- **v1.2 (~2–3 months):** App Store launch via EAS, Apple Health integration,
  multi-language if downloads justify (French + Arabic first).
- **v2 (only with traction):** optional encrypted cloud backup (Approach B),
  widgets, CGM/wearable exploration.

## Success Metrics

| Metric | Target | Source |
| ------ | ------ | ------ |
| Crash-free sessions | ≥ 99.5% | Play Console / Sentry |
| Day-7 retention | ≥ 20% | Play Console |
| Reminder opt-in rate | ≥ 60% of new users | in-app analytics |
| Store rating | ≥ 4.3 after 50 reviews | Play Console |
| Free→Plus conversion | 2–5% of active scanners | RevenueCat |
| API cost per free user | < $0.15/month | proxy logs |

## Out of Scope for This Spec

- Implementation details of the proxy, RevenueCat setup, or notification
  scheduling — these belong in the implementation plan.
- Any change to the existing glucose/food/exercise feature specs.
- App Store (iOS) submission specifics — planned at v1.2.
