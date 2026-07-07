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

## Baseline — Established 2026-07-07

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
| Card padding        | `spacing.xl` (20px)                 |
| Screen padding      | `spacing.xl` (20px)                 |
| Section gap         | `spacing.xxl` (28px)                |
| Shadow default      | `shadows.md` (2/8/0.04)             |
| Shadow subtle       | `shadows.sm` (1/4/0.03)             |
| Shadow elevated     | `shadows.lg` (4/12/0.06)            |
| Screen title        | 22px / 600                          |
| Section heading     | 17px / 600                          |
| Body text           | 15px / 400                          |
| Stat number         | 34px / 700                          |
| Reading value       | 32px / 700                          |
| Button label        | 15px / 600                          |
| Tab icon size       | 20px                                |
| Tab bar height      | 64px                                |

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
Last updated: 2026-07-07

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
| Spacing          | `spacing.xl` (20px) body padding, `spacing.sm` (8px) gap |
| Interactive      | none (static)            |
| Shadow           | `shadows.sm`             |
| Accent usage     | status color drives bar + value |

**Pattern notes:** Row layout: accent bar (4px) + body. Accent bar and value text share the same status color (green=normal, orange=borderline, red=high). No border — uses subtle shadow. Card uses `overflow: hidden` for clean radius on the accent bar top/bottom.

---

### DecisionCard

File: `features/glucose/components/DecisionCard.tsx`
Last updated: 2026-07-07

| Property         | Value                    |
| ---------------- | ------------------------ |
| Background       | `colors.surface`         |
| Border           | none                     |
| Border radius    | 14 (overflow hidden)     |
| Left accent bar  | 4px, color-coded         |
| Title            | 15px, 600, color-coded   |
| Message          | 14px, 400, `colors.textSecondary` |
| Spacing          | `spacing.xl` (20px) body padding, `spacing.md` (12px) gap |
| Interactive      | optional action Button   |
| Shadow           | `shadows.sm`             |
| Accent usage     | accent bar + title color |

**Pattern notes:** Same card structure as ReadingCard — row layout with accent bar + body. Used for pattern alerts and threshold warnings. Shares identical radius (14), shadow (sm), and accent bar pattern for visual consistency.

---

### TabBar (Navigation)

File: `navigation/AppNavigator.tsx`
Last updated: 2026-07-07

| Property         | Value                    |
| ---------------- | ------------------------ |
| Background       | `colors.surface`         |
| Top border       | 1px `colors.borderLight` |
| Height           | 64px                     |
| Active icon      | `colors.accent`          |
| Inactive icon    | `colors.textMuted`       |
| Icon font size   | 20px                     |
| Label font       | 11px, 500                |
| Icon shape       | Geometric Unicode symbols (◆◇●○■□▲△) |

**Pattern notes:** Tab bar uses geometric symbols instead of text labels. Active state uses filled symbol, inactive uses outlined. Four tabs: Dashboard, Food, Workout, Settings. Min height 64px with 8px top/bottom padding.

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
