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

## Components

### Button

File: `components/ui/Button.tsx`
Last updated: 2026-07-07

| Property         | Value                  |
| ---------------- | ---------------------- |
| Background (primary) | `colors.accent`    |
| Background (secondary) | `colors.surface` |
| Border (secondary) | 1px `colors.border` |
| Border radius    | 8                     |
| Text (primary)   | `colors.surface`, 14px, 500 |
| Text (secondary) | `colors.textPrimary`, 14px, 500 |
| Padding Y        | `spacing.sm` (8px)    |
| Padding X        | `spacing.lg` (16px)   |

**Pattern notes:** Two variants — primary and secondary. Primary uses accent background with white text. Secondary uses white background with border. No hover states in RN.

---

### Card

File: `components/ui/Card.tsx`
Last updated: 2026-07-07

| Property      | Value                |
| ------------- | -------------------- |
| Background    | `colors.surface`     |
| Border        | 1px `colors.border`  |
| Border radius | 16                   |
| Padding       | `spacing.xl` (24px)  |

**Pattern notes:** Universal card container used everywhere. Never override background color — cards are always white. Color goes inside via badges, borders, and text.

---

### Badge

File: `components/ui/Badge.tsx`
Last updated: 2026-07-07

| Property        | Value                    |
| --------------- | ------------------------ |
| Background      | `colors.surfaceSecondary` (default, overridable) |
| Border radius   | 999 (pill shape)         |
| Padding Y       | 2px                      |
| Padding X       | `spacing.sm` (8px)       |
| Text            | 12px, 500                |
| Text color      | `colors.textPrimary` (default, overridable) |

**Pattern notes:** Pill-shaped badge with configurable background and text color. Used for status labels, reading type indicators, and filter chips.

---

### Input

File: `components/ui/Input.tsx`
Last updated: 2026-07-07

| Property         | Value                |
| ---------------- | -------------------- |
| Background       | `colors.surface`     |
| Border           | 1px `colors.border`  |
| Border radius    | 8                    |
| Padding Y        | `spacing.sm` (8px)   |
| Padding X        | `spacing.md` (12px)  |
| Text             | 14px, `colors.textPrimary` |
| Placeholder      | `colors.textMuted`   |

**Pattern notes:** Standard text input. Placeholder color always set to `colors.textMuted`. For numeric inputs use `keyboardType="numeric"`.

---

### EmptyState

File: `components/ui/EmptyState.tsx`
Last updated: 2026-07-07

| Property      | Value                     |
| ------------- | ------------------------- |
| Padding Y     | `spacing.xxl` (32px)      |
| Gap           | `spacing.lg` (16px)       |
| Text          | 14px, 400, `colors.textMuted` |
| Alignment     | Center                    |
| Action button | Secondary Button variant  |

**Pattern notes:** Used in every section that can be empty. Action button is optional — shown only when both `actionLabel` and `onAction` are provided.

---

### LoadingSpinner

File: `components/ui/LoadingSpinner.tsx`
Last updated: 2026-07-07

| Property  | Value             |
| --------- | ----------------- |
| Color     | `colors.accent`   |
| Size      | large             |
| Container | Full screen, centered |

**Pattern notes:** Used as full-screen loading state. For inline loading, wrap the content area instead.

---

### ReadingCard

File: `features/glucose/components/ReadingCard.tsx`
Last updated: 2026-07-07

| Property          | Value                    |
| ----------------- | ------------------------ |
| Background        | `colors.surface`         |
| Border            | 1px `colors.border`      |
| Left border width | 4px (color-coded)        |
| Border radius     | 16                       |
| Padding           | `spacing.xl` (24px)      |
| Gap               | `spacing.sm` (8px)       |
| Type label        | 14px, 500, `colors.textSecondary` |
| Timestamp         | 12px, 400, `colors.textMuted` |
| Value             | 28px, 700, `colors.textPrimary` |

**Pattern notes:** Left border is color-coded by threshold status (green=normal, orange=borderline, red=high). Value always shows unit. Layout: type+time on top row, value below.

---

### DecisionCard

File: `features/glucose/components/DecisionCard.tsx`
Last updated: 2026-07-07

| Property          | Value                    |
| ----------------- | ------------------------ |
| Background        | `colors.surface`         |
| Border            | 1px `colors.border`      |
| Left border width | 4px (color-coded)        |
| Border radius     | 16                       |
| Padding           | `spacing.xl` (24px)      |
| Gap               | `spacing.md` (12px)      |
| Title             | 14px, 600, color-coded   |
| Message text      | 14px, 400, `colors.textSecondary` |

**Pattern notes:** Same card structure as ReadingCard but with title + message body. Used for pattern alerts and threshold warnings. Optional action button at the bottom.
