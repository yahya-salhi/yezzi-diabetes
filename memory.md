# Memory — Design Bible UI Enhancement

Last updated: 2026-07-08

## What was built

- **Created `components/ui/Icons.tsx`** — custom SVG icon system (Readings, Food, Workout, Settings, ChevronRight, Camera, Flame, Plus, CheckCircle, Clock) — 9 components, 24×24 viewBox, 1.8px round stroke, single-color
- **Created `context/screen-design-bible.md`** — locked design bible covering palette, texture, imagery, typography, iconography, corners, navigation, signature components, decorative assets, mockup rules for all 6 screens
- **Added `context/screen-design-bible.md`** to AGENTS.md as context file #10
- **Restructured DashboardScreen** — hero reading card (42px/700 value, 4px status bar, "In range" label), removed greeting/avatar, removed chart from first viewport, single "Add Reading" CTA, "Good range this week" summary
- **Refined AddReadingScreen** — removed Cancel button (single CTA), section titles bumped to 17/600
- **Built out HistoryScreen** — rolling-average stat strip (7/14/30/90d), readings grouped by day with dot timeline markers, pattern alerts pinned above list
- **Restructured FoodDashboardScreen** — "Highest Spikes This Week" insight block (info-blue accent bar), 72px camera FAB (was 56px), photo carousel shelf with scrim overlay
- **Built out WorkoutDashboardScreen** — streak badge + session count, PPL/Upper-Lower template cards, workout summaries, milestone tiles
- **Refined SettingsScreen** — grouped white list cells, 13px uppercase section headers, appearance toggle, data section with export/delete, chevron indicators
- **Updated ReadingCard** — removed shadow, added status label (13px/500, "In range" / "Above target")
- **Updated DecisionCard** — removed shadow and emoji indicators, title now textPrimary (not color-coded), action uses ghost, gap reduced to xs
- **Updated AppNavigator** — replaced Unicode tab icons with custom SVG icons
- **Updated useAverages** — added 14/30/90 day rolling average support
- **Updated thresholds.ts** — added `getThresholdLabel()` returning "In range" / "Above target"
- **Updated ui-registry.md** — updated 3 entries (ReadingCard, DecisionCard, TabBar), added 5 new (Icons, HeroCard, StatStrip, InsightCard, SettingsGroup), updated baseline

## Decisions made

- No shadow on cards — cards sit flush on warm background, shadow reserved for elevated elements only
- Screen titles 34px/700 for hero screens, 22px/600 for sub-screens
- Custom SVG icons over library icons — no generic Lucide-default feel
- DecisionCard title is textPrimary (not color-coded) — accent bar alone communicates severity
- Info blue (#4E7FA7) only appears in insight cards and chart lines, never elsewhere

## Problems solved

- TypeScript strict null check on `ThresholdStatus | null` — fixed with conditional guard in DashboardScreen

## Current state

- All 6 screens match screen-design-bible.md
- Tab bar uses custom brand SVG icons
- ReadingCard and DecisionCard share consistent card structure (no shadow, 4px accent bar, 14px radius)
- TypeScript compiles clean (0 errors)
- Expo passes all 18 checks
- Committed as `f7c0c96` on `feat/phase-2-features`, merged to `main`

## Next session starts with

Wire GPT-4o Vision integration for Snap Meal screen (feature 13 in build plan): save photo to documents directory via expo-file-system, convert to base64, POST to OpenAI with retry logic, parse JSON response, fallback to manual entry on failure.

## Open questions

None.
