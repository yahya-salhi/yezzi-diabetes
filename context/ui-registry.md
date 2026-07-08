# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact tokens and patterns
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact tokens used.

---

## Baseline — Established 2026-07-07 (updated 2026-07-08)

[Note: This baseline was established via /imprint audit after the premium design overhaul]

| Property            | Correct token value                |
| ------------------- | ---------------------------------- |
| Page background     | `colors.background` (#F4F2EE)      |
| Card/surface        | `colors.surface` (#FFFFFF)          |
| Secondary surface   | `colors.surfaceSecondary` (#FAF9F7) |
| Text primary        | `colors.textPrimary` (#1A1D1C)     |
| Text secondary      | `colors.textSecondary` (#6B6E6D)   |
| Text muted          | `colors.textMuted` (#A1A4A3)       |
| Accent              | `colors.accent` (#1B5E5A)          |
| Accent light        | `colors.accentLight` (#E8F0EF)     |
| Success             | `colors.success` (#1B8A5A)         |
| Warning             | `colors.warning` (#B8860B)         |
| Error               | `colors.error` (#C5304B)           |
| Info                | `colors.info` (#4E7FA7)            |
| Border              | `colors.border` (#E3DFD8)          |
| Border light        | `colors.borderLight` (#EDEAE4)     |
| Card radius         | 14px                                |
| Button/Input radius | 10px                                |
| Badge radius        | 999px (pill)                        |
| Card inner padding  | `spacing.xl` (20px)                 |
| Screen outer padding| `spacing.xl` (20px)                 |
| Section gap         | `spacing.xxl` (28px)                |
| Shadow default      | `shadows.md` (2/8/0.04)             |
| Shadow subtle       | `shadows.sm` (1/4/0.03)             |
| Shadow elevated     | `shadows.lg` (4/12/0.06)            |
| Screen title — hero  | 34px / 700 (Dashboard, Food, Workout, Settings, History) |
| Screen section title| 22px / 600 (sub-screens, modals)     |
| Section heading     | 17px / 600                          |
| Body text           | 15px / 400                          |
| Stat number         | 34px / 700                          |
| Reading value       | 32px / 700                          |
| Button label        | 15px / 600                          |
| Tab icon size       | 22px (SVG)                          |
| Tab icon stroke     | 1.8px                               |
| Tab bar height      | 64px                                |
| FAB size            | 72px circle                          |
| FAB default radius  | 36px (circle)                       |

---

## Components

### Card

File: `components/ui/Card.tsx`
Last updated: 2026-07-07

| Property         | Value                              |
| ---------------- | ---------------------------------- |
| Background       | `colors.surface`                   |
| Border           | none                               |
| Border radius    | 14                                 |
| Text — primary   | inherited from parent              |
| Text — secondary | inherited from parent              |
| Spacing          | `spacing.xl` (20px) padding        |
| Interactive      | none (static container)            |
| Shadow           | `shadows.md` (default)             |
| Accent usage     | none (color goes inside via children) |

**Pattern notes:** Universal card container. No border — uses subtle shadow for depth. Never override background — always white. Never stack cards inside cards (no box-in-box).

---

### Button

File: `components/ui/Button.tsx`
Last updated: 2026-07-07

| Property         | Primary            | Secondary                  | Ghost                |
| ---------------- | ------------------ | -------------------------- | -------------------- |
| Background       | `colors.accent`    | `colors.surface`           | transparent          |
| Border           | none               | 1px `colors.border`        | none                 |
| Border radius    | 10                 | 10                         | 10                   |
| Text             | #FFFFFF            | `colors.textPrimary`       | `colors.accent`      |
| Font             | `typography.buttonLabel` (15px/600) | same           | same                 |
| Spacing          | 12px vertical, `spacing.xl` horizontal | same       | 12px vertical, `spacing.lg` horizontal |
| Min height       | 44px               | 44px                       | 44px                 |
| Interactive      | none in RN         | none                       | none                 |
| Shadow           | none               | none                       | none                 |

**Pattern notes:** Three variants — primary (filled accent), secondary (outlined), ghost (text-only). All share 10px radius, 12px vertical padding, 44px min height for touch targets.

---

### Input

File: `components/ui/Input.tsx`
Last updated: 2026-07-07

| Property         | Value                    |
| ---------------- | ------------------------ |
| Background       | `colors.surface`         |
| Border           | 1px `colors.border`      |
| Border radius    | 10                       |
| Text             | 15px, `colors.textPrimary` |
| Placeholder      | 15px, `colors.textMuted` |
| Spacing          | 14px vertical, `spacing.xl` horizontal |
| Interactive      | focus: `colors.accent` border |
| Shadow           | none                     |
| Accent usage     | focus border color       |

**Pattern notes:** Standard text input. Always set placeholderTextColor. Focus state changes border to accent. For numeric inputs use keyboardType="numeric".

---

### Badge

File: `components/ui/Badge.tsx`
Last updated: 2026-07-07

| Property         | Value                    |
| ---------------- | ------------------------ |
| Background       | `colors.surfaceSecondary` (default, overridable) |
| Border           | none                     |
| Border radius    | 999 (pill)               |
| Text             | 13px, 500, `colors.textPrimary` (default, overridable) |
| Spacing          | 3px vertical, 10px horizontal |
| Interactive      | none (static)            |
| Shadow           | none                     |
| Accent usage     | overridable color/text props |

**Pattern notes:** Pill-shaped badge. Background and text color are overridable for status usage. Used for reading type indicators and filter chips.

---

### EmptyState

File: `components/ui/EmptyState.tsx`
Last updated: 2026-07-07

| Property         | Value                     |
| ---------------- | ------------------------- |
| Background       | inherited                 |
| Border           | none                      |
| Border radius    | none                      |
| Text             | 15px, 400, `colors.textMuted` |
| Spacing          | `spacing.xxl` (28px) vertical padding, `spacing.lg` (16px) gap |
| Interactive      | optional secondary Button |
| Shadow           | none                      |
| Accent usage     | none                      |

**Pattern notes:** Used in every section that can be empty. Centered layout. Action button is optional — shown only when both `actionLabel` and `onAction` are provided.

---

### LoadingSpinner

File: `components/ui/LoadingSpinner.tsx`
Last updated: 2026-07-07

| Property         | Value                   |
| ---------------- | ----------------------- |
| Background       | none (transparent)      |
| Border           | none                    |
| Border radius    | none                    |
| Text             | none                    |
| Spacing          | full screen centered    |
| Interactive      | none                    |
| Shadow           | none                    |
| Accent usage     | `colors.accent` spinner |

**Pattern notes:** Used as full-screen loading state. Minimal — just a centered ActivityIndicator in accent color.

---

### ReadingCard

File: `features/glucose/components/ReadingCard.tsx`
Last updated: 2026-07-08

| Property         | Value                    |
| ---------------- | ------------------------ |
| Background       | `colors.surface`         |
| Border           | none                     |
| Border radius    | 14 (overflow hidden)     |
| Left accent bar  | 4px, color-coded (success/warning/error) |
| Type label       | 14px, 500, `colors.textSecondary` |
| Timestamp        | 13px, 400, `colors.textMuted` |
| Value            | 32px, 700, color-coded by status |
| Unit             | 16px, 500, same color as value |
| Status label     | 13px, 500, same color as value ("In range" / "Above target") |
| Spacing          | `spacing.xl` (20px) body padding, `spacing.sm` (8px) gap |
| Interactive      | none (static)            |
| Shadow           | none                     |
| Accent usage     | status color drives bar + value + status label |

**Pattern notes:** Row layout: accent bar (4px) + body. No shadow — cards sit flush on the background. Accent bar, value text, and status label all share the same status color (success=in range, warning=above target, error=above target). Status label added below value for extra clarity. Card uses `overflow: hidden` for clean radius on the accent bar top/bottom.

---

### DecisionCard

File: `features/glucose/components/DecisionCard.tsx`
Last updated: 2026-07-08

| Property         | Value                    |
| ---------------- | ------------------------ |
| Background       | `colors.surface`         |
| Border           | none                     |
| Border radius    | 14 (overflow hidden)     |
| Left accent bar  | 4px, color-coded         |
| Title            | 15px, 600, `colors.textPrimary` (NOT color-coded) |
| Message          | 14px, 400, `colors.textSecondary` |
| Spacing          | `spacing.xl` (20px) body padding, `spacing.xs` (4px) gap |
| Action           | ghost Button with `marginTop: spacing.sm` |
| Shadow           | none                     |
| Accent usage     | accent bar only (title is textPrimary) |

**Pattern notes:** Same row layout + accent bar as ReadingCard — shares radius (14), no shadow, and 4px accent bar. No emoji or decorative symbols in the title. Title is always textPrimary (not color-coded) — the accent bar alone communicates severity. Action button uses ghost variant to keep visual weight low. Body gap reduced to xs for tighter copy spacing.

---

### TabBar (Navigation)

File: `navigation/AppNavigator.tsx`
Last updated: 2026-07-08

| Property         | Value                    |
| ---------------- | ------------------------ |
| Background       | `colors.surface`         |
| Top border       | 1px `colors.borderLight` |
| Height           | 64px                     |
| Active icon      | `colors.accent`          |
| Inactive icon    | `colors.textMuted`       |
| Icon component   | Custom SVG (`components/ui/Icons.tsx`) |
| Icon size        | 22px, 1.8px stroke       |
| Icon container   | 28×28px centered          |
| Label font       | 11px, 500                |
| Icon set         | ReadingsIcon, FoodIcon, WorkoutIcon, SettingsIcon |

**Pattern notes:** Custom SVG icons replace the old Unicode symbols. Each icon is a 24×24 viewBox rendered at 22px with 1.8px stroke, single color, rounded caps/joins. Active state uses teal fill, inactive uses textMuted. Four tabs: Dashboard, Food, Workout, Settings. Icon container is centered within the 64px bar.

---

### Icons

File: `components/ui/Icons.tsx`
Last updated: 2026-07-08

| Property         | Value                    |
| ---------------- | ------------------------ |
| Render engine    | `react-native-svg` (`Svg`, `Path`, `Circle`, `Line`, `Rect`) |
| ViewBox          | 24×24                     |
| Default size     | 24px                      |
| Default color    | `#6B6E6D` (textSecondary) |
| Default stroke   | 1.8px                     |
| Stroke caps      | `round`                   |
| Stroke joins     | `round`                   |
| Fill             | none                      |
| Icon components  | ReadingsIcon, FoodIcon, WorkoutIcon, SettingsIcon, ChevronRightIcon, CameraIcon, FlameIcon, PlusIcon, CheckCircleIcon, ClockIcon |

**Pattern notes:** All icons share the same Props interface (`size`, `color`, `strokeWidth` with defaults), the same `useDefaults` helper, and the same rendering pattern (Svg + Path primitives, fill="none"). Colors are always single-tone — no multi-color icons. Stroke weight is always 1.8px. For tab bar usage, pass `size={22}` and `color` from the active/inactive state. For inline usage (ChevronRight), pass `size={18}`. For the FAB, pass `size={28}` with `#FFFFFF`. Never mix stroke weights or icon styles across the app — always use these components.

---

### TrendChart

File: `features/glucose/components/TrendChart.tsx`
Last updated: 2026-07-07

| Property            | Value                           |
| ------------------- | ------------------------------- |
| Background          | `colors.surface`                |
| Border              | none                            |
| Border radius       | 14                              |
| Shadow              | `shadows.sm`                    |
| Section title       | 17px, 600, `colors.textPrimary` |
| Legend dot          | 8px circle                      |
| Legend label        | 12px, 500, `colors.textSecondary` |
| X/Y axis labels     | 10px, `colors.textMuted`        |
| Reference line 1    | 70 mg/dL, dashed, green         |
| Reference line 2    | 140 mg/dL, dashed, red          |
| Line thickness      | 2.5px                           |
| Data point shape    | circle, 6px                     |
| Gradient fill       | line color, 12% → 4% opacity   |
| Tooltip bg          | `colors.textPrimary`, 6px radius |
| Tooltip text        | 13px, 600, #FFFFFF              |
| Range legend text   | 11px, 400, `colors.textMuted`   |
| Empty state text    | 14px, 400, `colors.textMuted`   |
| Chart height        | 220px                           |
| Spacing             | dynamic 40–80px based on data count |

**Pattern notes:** Wrapper includes section title + interactive legend row above the chart card. Two reference lines indicate normal glucose range (70–140 mg/dL) with dashed styling. Touch interaction shows tooltip with value. Empty state is a simple card without nested Card component.

---

### MealCard

File: `features/food/components/MealCard.tsx`
Last updated: 2026-07-07

| Property         | Value                           |
| ---------------- | ------------------------------- |
| Background       | `colors.surface`                |
| Border           | none                            |
| Border radius    | 14                              |
| Food name        | 16px, 600, `colors.textPrimary` |
| Nutrition bg     | `colors.surfaceSecondary`       |
| Nutrition radius | 10                              |
| Nutrition value  | 18px, 700, `colors.textPrimary` |
| Nutrition label  | 12px, 500, `colors.textMuted`   |
| Nutrition divider| 1px `colors.borderLight`        |
| Timestamp        | 13px, `colors.textMuted`        |
| Spacing          | `spacing.xl` (20px) padding, `spacing.md` (12px) gap |
| Interactive      | none (static)                   |
| Shadow           | `shadows.sm`                    |
| Accent usage     | badge (via Badge component)     |

**Pattern notes:** Follows same card pattern as ReadingCard/DecisionCard — surface background, 14px radius, subtle shadow. Inner nutrition row uses surfaceSecondary background with 10px radius (shared with Button radius). Nutrition items separated by 1px borderLight dividers. Uses Badge component for meal type label.

---

### MealLinkSuggestion

File: `features/food/components/MealLinkSuggestion.tsx`
Last updated: 2026-07-07

| Property        | Value                            |
| --------------- | -------------------------------- |
| Background      | `colors.surface`                 |
| Border          | none                             |
| Border radius   | 14 (overflow hidden)             |
| Left accent bar | 4px, `colors.info`               |
| Title           | 15px, 600, `colors.info`         |
| Message         | 14px, 400, `colors.textSecondary`, lineHeight 20 |
| Spacing         | `spacing.xl` (20px) body padding, `spacing.sm` (8px) gap |
| Interactive     | action buttons (primary + ghost) |
| Shadow          | `shadows.sm`                     |
| Accent usage    | info color accent bar + title    |

**Pattern notes:** Same row layout + accent bar structure as ReadingCard and DecisionCard — 4px left accent bar, surface background, 14px radius with overflow hidden for clean bar corners. Actions row right-aligned with ghost + primary Button pair. Use this exact structure for any future suggestion/prompt card.

---

### CameraView

File: `features/food/components/CameraView.tsx`
Last updated: 2026-07-07

| Property            | Value                              |
| ------------------- | ---------------------------------- |
| Background          | `#000` (full-screen camera)        |
| Permission bg       | `colors.background`                |
| Permission title    | 20px, 600, `colors.textPrimary`    |
| Permission msg      | 15px, 400, `colors.textSecondary`  |
| Permission button   | `colors.accent`, 10px radius       |
| Top button          | 44px circle, `rgba(0,0,0,0.4)` bg |
| Overlay bg          | `rgba(0,0,0,0.3)`                 |
| Crop corners        | 24px, 3px white border             |
| Capture button      | 72px circle, 4px white border      |
| Capture inner       | 60px circle, `#FFFFFF`             |
| Hint text           | 14px, 500, `rgba(255,255,255,0.8)` |
| Button radius       | 10                                 |

**Pattern notes:** Full-screen camera with semi-transparent overlays for the crop guide. Permission denied state uses brand tokens (background, accent button). All interactive elements are circular with semi-transparent backgrounds over the camera feed. Capture button is the primary action — large circle with inner circle.

---

### NutritionBreakdown

File: `features/food/components/NutritionBreakdown.tsx`
Last updated: 2026-07-07

| Property        | Value                              |
| --------------- | ---------------------------------- |
| Background      | inherited (transparent)            |
| Section title   | 15px, 600, `colors.textPrimary`    |
| Field label     | 13px, 500, `colors.textSecondary`  |
| Input           | `colors.surface`, 1px `colors.border`, 10px radius |
| Input text      | 16px, 600, `colors.textPrimary`    |
| Input padding   | 12px vertical, `spacing.md` horizontal |
| Grid layout     | 2-col (`width: 47%`), `spacing.sm` gap |
| Spacing         | `spacing.md` (12px) container gap  |

**Pattern notes:** 2-column grid of numeric inputs for nutrition values. Each input follows the standard Input pattern (surface bg, border, 10px radius) with 16px/600 bold for the numeric value. Used inside the Snap Meal review screen for editable nutrition fields.

---

### MealReviewForm

File: `features/food/components/MealReviewForm.tsx`
Last updated: 2026-07-08

| Property          | Value                                 |
| ----------------- | ------------------------------------- |
| Background        | `colors.background`                   |
| Content padding   | `spacing.xl` (20px)                   |
| Section gap       | `spacing.xxl` (28px) between sections |
| Section spacing   | `spacing.md` (12px) gap inside section|
| Section title     | 15px, 600, `colors.textPrimary`       |
| Photo             | 240px height, 14px radius, `colors.surfaceSecondary` bg |
| Input             | `colors.surface`, 1px `colors.border`, 10px radius, 14px vertical padding, `spacing.xl` horizontal, 15px text |
| Textarea          | minHeight 90, textAlignVertical top    |
| Type chip         | 10px radius, 1px `colors.border`, `colors.surface` bg, `colors.textSecondary` 14px/500 text |
| Type chip selected| `colors.accent` border, `colors.accentLight` bg, `colors.accent` 14px/600 text |
| Save error        | 13px, 500, `colors.error`, center     |
| Action buttons    | Button component (primary + secondary), `spacing.md` gap |

**Pattern notes:** Shared review/edit form used by both SnapMealScreen and ManualEntryScreen. Never used standalone — always rendered inside a screen. Photo is optional (shown only when available). Uses NutritionBreakdown and EstimatedImpactBadge internally. Section titles follow the 15px/600 pattern (not the 22px/600 section heading — these are sub-section labels). Type chips are not a separate component — they're inline TouchableOpacity elements with consistent border/accent styling.

---

### ApiKeyModal (inline pattern)

File: `features/food/screens/SnapMealScreen.tsx` and `features/food/screens/ManualEntryScreen.tsx` (inline)
Last updated: 2026-07-08

| Property          | Value                                |
| ----------------- | ------------------------------------ |
| Overlay bg        | `rgba(0,0,0,0.5)`                    |
| Modal bg          | `colors.surface`                     |
| Modal radius      | 16                                   |
| Modal padding     | `spacing.xxl` (28px)                 |
| Modal gap         | `spacing.lg` (16px)                  |
| Title             | 18px, 600, `colors.textPrimary`, center |
| Message           | 14px, 400, `colors.textSecondary`, center, lineHeight 20 |
| Key input         | `colors.surfaceSecondary` bg, 1px `colors.border`, 10px radius, 14px vertical padding, `spacing.lg` horizontal, 15px text |
| Primary button    | `colors.accent` bg, 10px radius, 14px vertical padding, `spacing.xxl` horizontal, full width, 15px/600 white |
| Cancel link       | 14px, 500, `colors.textMuted`        |

**Pattern notes:** Full-screen overlay modal for API key entry. Identical pattern in both SnapMealScreen and ManualEntryScreen — replicate exactly if used elsewhere. Modal uses 16px radius (slightly larger than the 14px card radius) to distinguish it as an overlay. Key input uses surfaceSecondary background (not surface) to visually differentiate from the modal surface. Primary button is full-width (not a standard width Button component). Cancel is a text link below the button, not a secondary Button.

---

### MealLinkPicker (inline — AddReadingScreen)

File: `features/glucose/screens/AddReadingScreen.tsx` (inline, multi-meal variant)
Last updated: 2026-07-08

| Property         | Value                              |
| ---------------- | ---------------------------------- |
| Overlay bg       | `rgba(0,0,0,0.4)`                  |
| Modal content    | card(s) centered in overlay        |
| Card radius      | 14                                 |
| Card bg          | `colors.surface`                   |
| Card padding     | `spacing.xl` (20px)                |
| Card gap         | `spacing.sm` (8px)                 |
| Title            | 17px, 600, `colors.textPrimary`    |
| Row layout       | row, space-between, center         |
| Row padding      | `spacing.md` (12px) vertical       |
| Row divider      | 1px `colors.border`, bottom        |
| Meal name        | 15px, 500, `colors.textPrimary`    |
| Impact value     | 14px, 600, `colors.info`           |
| Skip button      | ghost Button                       |

**Pattern notes:** Used when saving a post-meal reading and multiple unlinked meals exist. Shows above the `MealLinkSuggestion` component (which is rendered for the single-meal case). The card structure matches the standard card pattern (surface, 14px radius, xl padding). Overlay matches the ApiKeyModal approach but uses 0.4 opacity (slightly lighter than ApiKeyModal's 0.5). Rows use border-bottom dividers (matching SettingsGroup row dividers) but the border is `colors.border` (not `borderLight` like SettingsGroup). Impact values use `colors.info` to match MealLinkSuggestion's info-blue accent.

---

### EstimatedImpactBadge

File: `features/food/components/EstimatedImpactBadge.tsx`
Last updated: 2026-07-07

| Property       | Value                                |
| -------------- | ------------------------------------ |
| Background     | dynamic: `colors.success` / `warning` / `error` based on impact value (<20/20-40/40+) |
| Border         | none                                 |
| Border radius  | 12                                   |
| Label          | 12px, 500, `rgba(255,255,255,0.8)`, uppercase |
| Value          | 20px, 700, `#FFFFFF`                 |
| Spacing        | `spacing.md` (12px) vertical, `spacing.lg` (16px) horizontal, 4px gap |
| Shadow         | none                                 |
| Accent usage   | background color drives severity (green/yellow/red) |

**Pattern notes:** Color-coded badge that communicates estimated glucose impact severity. Follows the same three-tier color system as ReadingCard (success/warning/error thresholds). Always shows the value prominently. Used inside the Snap Meal review screen below the nutrition fields.

---

### HeroCard (Dashboard)

File: `features/glucose/screens/DashboardScreen.tsx` (inline)
Last updated: 2026-07-08

| Property         | Value                            |
| ---------------- | -------------------------------- |
| Background       | `colors.surface`                 |
| Border           | none                             |
| Border radius    | 14 (overflow hidden)             |
| Left accent bar  | 4px, color-coded by status       |
| Label            | 14px, 500, `colors.textSecondary` |
| Value            | 42px, 700, color-coded by status |
| Unit             | 18px, 500, same color as value   |
| Status text      | 15px, 500, same color as value   |
| Spacing          | `spacing.xl` (20px) padding, `spacing.xs` (4px) gap |
| Shadow           | none                             |
| Empty state      | `—` 42px/700 textMuted + "No readings today" 15px/500 textSecondary, centered |

**Pattern notes:** Same card structure as ReadingCard but larger — 42px value vs 32px. Used as the primary focal point on Dashboard. Uses identical left accent bar, surface background, and overflow-hidden radius. No shadow. The empty state is centered text (no accent bar) with muted value and secondary label — never shows both states simultaneously.

---

### StatStrip (History rolling averages)

File: `features/glucose/screens/HistoryScreen.tsx` (inline)
Last updated: 2026-07-08

| Property         | Value                           |
| ---------------- | ------------------------------- |
| Background       | `colors.surface`                |
| Border           | none                            |
| Border radius    | 14                              |
| Layout           | horizontal row, equal flex items |
| Value            | 22px, 700, `colors.textPrimary` |
| Label            | 11px, 500, `colors.textMuted`, uppercase, letterSpacing 0.5 |
| Spacing          | `spacing.lg` (16px) padding     |
| Item gap         | none (flex: 1 fills space)      |
| Shadow           | none                            |
| Min items        | 4 (7d/14d/30d/90d)              |

**Pattern notes:** Compact horizontal strip of multiple stat windows embedded in a single surface card. Each stat is evenly spaced via flex:1. Labels are always uppercase and muted. Value uses the statNumber token size (22px in this compact variant). Never add dividers between items — spacing comes from the equal flex distribution.

---

### InsightCard (Highest Spikes)

File: `features/food/screens/FoodDashboardScreen.tsx` (inline)
Last updated: 2026-07-08

| Property                 | Value                            |
| ------------------------ | -------------------------------- |
| Background               | `colors.surface`                 |
| Border                   | none                             |
| Border radius            | 14 (overflow hidden)             |
| Left accent bar          | 4px, `colors.info`               |
| Title                    | 15px, 600, `colors.textPrimary`  |
| Row layout               | flex row, left/right split, `alignItems: flex-start` |
| Left side                | flex:1 with `marginRight: spacing.md` |
| Right side               | `alignItems: flex-end`, 2px gap |
| Food name                | 14px, 600, `colors.textPrimary`  |
| Meal type badge          | Badge component (default colors) |
| Meal time                | 12px, 400, `colors.textMuted`    |
| Actual impact            | 15px, 700, `colors.info`         |
| Estimated comparison     | 12px, 400, `colors.textMuted`    |
| Spacing                  | `spacing.xl` (20px) body padding, `spacing.md` (12px) gap between sections, `spacing.sm` (8px) row gap, `spacing.xs` (4px) inside left/right |
| Shadow                   | none                             |
| Accent usage             | info accent bar + actual impact values |
| Visibility               | hidden when fewer than 2 linked pairs |

**Pattern notes:** Same row layout + accent bar structure as ReadingCard/DecisionCard. Uses info blue (`#4E7FA7`) for the accent bar and impact values — the only place info blue appears in the UI. Title is textPrimary, not color-coded. Used for the "Highest Spikes This Week" summary on the Food Log. Each row shows left (food name + badge + time) and right (actual impact + estimated comparison). The card is only visible when 2+ linked meal+reading pairs exist in the last 7 days. Badge + time sit in a meta row below the food name with `spacing.sm` gap.

---

### SettingsGroup

File: `features/settings/screens/SettingsScreen.tsx` (inline)
Last updated: 2026-07-08

| Property         | Value                            |
| ---------------- | -------------------------------- |
| Container bg     | `colors.surface`                 |
| Container radius | 14                               |
| Row min height   | 48px                             |
| Row padding      | `spacing.xl` (20px) horizontal, `spacing.md` (12px) vertical |
| Label            | 15px, 400, `colors.textPrimary`  |
| Value            | 15px, 500, `colors.textSecondary`|
| Chevron icon     | `ChevronRightIcon`, 18px, `colors.textMuted` |
| Divider          | 1px, `colors.borderLight`, `marginLeft: spacing.xl` |
| Section header   | 13px, 500, `colors.textMuted`, letterSpacing 0.5, uppercase |
| Toggle track     | off: `colors.border`, on: `colors.accentLight` |
| Toggle thumb     | off: `colors.surface`, on: `colors.accent` |

**Pattern notes:** White rounded card containing vertical rows separated by indented dividers. Each row has a label on the left and either a value + chevron, a toggle, or a standalone action on the right. Section headers sit outside the card (above it) in muted uppercase. No shadow. Never add icons inside the label area — chevrons go on the right only. Danger actions use `colors.error` for the label.
