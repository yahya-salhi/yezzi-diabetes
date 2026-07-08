# Memory — Snap Meal Camera + Review UI

Last updated: 2026-07-07

## What was built

- **Created `features/food/components/CameraView.tsx`** — full-screen expo-camera with permission gate, square crop overlay with white corner guides, flash toggle (on/off), capture button (72px circle), close button, hint text
- **Created `features/food/components/NutritionBreakdown.tsx`** — 2-column editable grid for calories, carbs, protein, fat with numeric inputs following standard Input pattern
- **Created `features/food/components/EstimatedImpactBadge.tsx`** — color-coded badge (green <20, yellow 20-40, red 40+) with uppercase label and prominent value
- **Created `features/food/screens/SnapMealScreen.tsx`** — three-mode screen (camera → loading skeleton with spinner → review) with mock pre-filled data after 1.8s delay
- **Updated `features/food/screens/FoodDashboardScreen.tsx`** — FAB now navigates to SnapMeal screen
- **Updated `navigation/AppNavigator.tsx`** — added FoodStack navigator with SnapMeal as modal screen
- **Updated `context/progress-tracker.md`** — marked 12 Snap Meal complete
- **Updated `context/ui-registry.md`** — imprinted CameraView, NutritionBreakdown, EstimatedImpactBadge
- **Installed `expo-camera` and `expo-file-system`**
- **Committed** as `2a9218d`

## Decisions made

- Camera uses `expo-camera` directly with ref-based capture (`cameraRef.takePictureAsync()`) — no wrapper abstraction
- Square crop overlay is purely visual (white corner guides, semi-transparent dimming) — actual crop not yet implemented
- Review screen uses mock data with `setTimeout` simulation of AI analysis — real GPT-4o integration comes in next feature
- Loading skeleton matches review screen layout (photo placeholder, text lines, grid boxes) for smooth transition
- EstimatedImpactBadge thresholds: <20 green, 20-40 yellow, 40+ red — matches reading severity color system

## Problems solved

None — straightforward build.

## Current state

- Camera opens, captures photo, shows loading skeleton, transitions to review with mock data
- Review screen shows photo thumbnail, editable food name, editable nutrition fields, impact badge, meal type picker, notes, save button
- TypeScript compiles clean
- No GPT-4o Vision integration yet — review data is mocked
- No save logic — save button just navigates back

## Next session starts with

Wire GPT-4o Vision integration (13 GPT-4o Vision Integration): save photo to documents directory via expo-file-system, convert to base64, POST to OpenAI with retry logic, parse JSON response, fallback to manual entry on failure.

## Open questions

None.

---

# Session — Design Bible UI Enhancement

Last updated: 2026-07-08

## What was built

- **Created `components/ui/Icons.tsx`** — custom SVG icon system (Readings, Food, Workout, Settings, ChevronRight, Camera, Flame, Plus, CheckCircle, Clock) — 9 components, 24×24 viewBox, 1.8px round stroke
- **Created `context/screen-design-bible.md`** — locked design bible for all 6 screens (palette, texture, typography, iconography, corners, navigation, signature components)
- **Added `context/screen-design-bible.md`** to AGENTS.md as #10 context file
- **Restructured DashboardScreen** — hero reading card (42px/700 value, 4px status bar, "In range" label), removed greeting/avatar, removed chart from first viewport, single "Add Reading" CTA, "Good range this week" summary, `getThresholdLabel()` utility
- **Refined AddReadingScreen** — removed Cancel button (single CTA), section titles bumped to 17/600
- **Built out HistoryScreen** — rolling-average stat strip (7/14/30/90d), readings grouped by day with dot timeline markers, pattern alerts pinned above list
- **Restructured FoodDashboardScreen** — "Highest Spikes This Week" insight block (info-blue accent bar), 72px camera FAB (was 56px), photo carousel shelf with scrim overlay
- **Built out WorkoutDashboardScreen** — streak badge + session count, PPL/Upper-Lower template cards, workout summaries, milestone tiles
- **Refined SettingsScreen** — grouped white list cells, 13px uppercase section headers, appearance toggle, data section with export/delete, chevron indicators
- **Updated ReadingCard** — removed `shadows.sm`, added status label (13px/500, "In range" / "Above target")
- **Updated DecisionCard** — removed shadow and emoji indicators, title now textPrimary (not color-coded), action uses ghost, gap reduced to xs
- **Updated AppNavigator** — replaced Unicode tab icons (◆◇●○■□▲△) with custom SVG icons
- **Updated useAverages** — added 14/30/90 day rolling average support
- **Updated thresholds.ts** — added `getThresholdLabel()` returning "In range" / "Above target"
- **Updated ui-registry.md** — updated 3 entries (ReadingCard, DecisionCard, TabBar), added 5 new (Icons, HeroCard, StatStrip, InsightCard, SettingsGroup), updated baseline

## Decisions made

- No shadow on cards — cards sit flush on the warm background, shadow reserved for elevated elements only
- Screen titles bumped to 34px/700 for hero screens — design bible specifies 22px/600 for sub-screens, 34px/700 for primary screens
- Custom SVG icons over library icons — matches design bible's "no generic Lucide-default feel" mandate
- DecisionCard title no longer color-coded — accent bar alone communicates severity
- Info blue (#4E7FA7) only appears in insight cards and chart lines, never elsewhere

## Current state

- All 6 screens match screen-design-bible.md
- Tab bar uses custom brand icons
- ReadingCard and DecisionCard share consistent card structure (no shadow, 4px accent bar, 14px radius)
- TypeScript compiles clean
- Expo passes all 18 checks

## Next session starts with

GPT-4o Vision integration for Snap Meal screen.

## Open questions

None.
