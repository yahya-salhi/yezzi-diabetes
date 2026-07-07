# UI Tokens

Design tokens for YeZZ. All colors, typography, spacing, and component values defined here. Use these exact values throughout the codebase — never hardcode colors or use raw values in components.

---

## How to Use

This project uses React Native `StyleSheet` for styling. Define a tokens/constants file and import tokens across all components.

```typescript
// Correct — imports token
import { colors, typography, spacing } from "@/theme/tokens";

style={[styles.card, { backgroundColor: colors.surface }]}

// Never — hardcoded hex values
style={{ backgroundColor: '#FFFFFF' }}
```

---

## Color Palette

### Page Layout

| Element           | Token              | Hex       |
| ----------------- | ------------------ | --------- |
| Page background   | `colors.background`| #F6F7FB   |
| Card / surface    | `colors.surface`   | #FFFFFF   |
| Secondary surface | `colors.surfaceSecondary` | #F9FAFB |

### Text

| Element                | Token              | Hex       |
| ---------------------- | ------------------ | --------- |
| Headings, primary text | `colors.textPrimary` | #101828   |
| Secondary text, labels | `colors.textSecondary` | #6A7282 |
| Placeholder, muted     | `colors.textMuted` | #99A1AF   |

### Semantic Colors

| Token              | Hex       | Usage                              |
| ------------------ | --------- | ---------------------------------- |
| `colors.accent`    | #7C5CFC   | Primary buttons, active states     |
| `colors.success`   | #10B981   | Normal readings, good trends       |
| `colors.warning`   | #FF8904   | Borderline readings                |
| `colors.error`     | #EF4444   | High readings, alerts              |
| `colors.info`      | #61A8FF   | Informational cards, chart lines   |

### Borders

| Token             | Hex       |
| ----------------- | --------- |
| `colors.border`   | #E7EAF3   |
| `colors.borderLight` | #E5E7EB |

---

## Typography

| Element              | Size | Weight | Line height | Color                    |
| -------------------- | ---- | ------ | ----------- | ------------------------ |
| Stat number          | 30px | 700    | 36px        | `colors.textPrimary`     |
| Screen title         | 20px | 600    | 28px        | `colors.textPrimary`     |
| Section heading      | 16px | 600    | 24px        | `colors.textPrimary`     |
| Body text            | 14px | 400    | 20px        | `colors.textPrimary`     |
| Card label           | 14px | 500    | 20px        | `colors.textSecondary`   |
| Reading value        | 28px | 700    | 34px        | varies by status         |
| Timestamp / muted    | 12px | 400    | 16px        | `colors.textMuted`       |
| Badge text           | 12px | 500    | 16px        | varies by type           |

Font family: **Inter** (loaded via `expo-font`).

---

## Spacing

| Token      | Value | Usage                        |
| ---------- | ----- | ---------------------------- |
| `spacing.xs`  | 4px   | Tight inline gaps            |
| `spacing.sm`  | 8px   | Badge and tag gaps           |
| `spacing.md`  | 12px  | Form field gaps              |
| `spacing.lg`  | 16px  | Section internal gaps        |
| `spacing.xl`  | 24px  | Between sections             |
| `spacing.xxl` | 32px  | Page padding                 |

---

## Component Tokens

### Cards

```
backgroundColor: colors.surface
borderWidth: 1
borderColor: colors.border
borderRadius: 16
padding: spacing.xl
```

### Buttons

**Primary:**
```
backgroundColor: colors.accent
color: #FFFFFF
borderRadius: 8
paddingVertical: spacing.sm
paddingHorizontal: spacing.lg
fontSize: 14
fontWeight: 500
```

**Secondary:**
```
backgroundColor: colors.surface
borderWidth: 1
borderColor: colors.border
color: colors.textPrimary
borderRadius: 8
paddingVertical: spacing.sm
paddingHorizontal: spacing.lg
```

### Input Fields

```
backgroundColor: colors.surface
borderWidth: 1
borderColor: colors.border
borderRadius: 8
paddingVertical: spacing.sm
paddingHorizontal: spacing.md
fontSize: 14
color: colors.textPrimary
```

### Badges

```
borderRadius: 999
paddingVertical: 2
paddingHorizontal: 8
fontSize: 12
fontWeight: 500
```

### Decision Cards

| Status | Background           | Border             | Text                 |
| ------ | -------------------- | ------------------ | -------------------- |
| Normal | `colors.surface`     | `colors.success`   | `colors.success`     |
| High   | `colors.surface`     | `colors.error`     | `colors.error`       |
| Info   | `colors.surface`     | `colors.info`      | `colors.info`        |

### Glucose Reading Card

```
Reading value:     28px, weight 700
Reading label:     12px, weight 400, color textMuted
Status indicator:  Left border color-coded (success / warning / error)
```

---

## Invariants

- Never use hex values directly in components — always reference `colors.*` tokens
- Font is Inter — always load via expo-font, never use system font fallback
- Glucose reading cards always use left-border color coding for status
- Decision cards are always outlined (colored border, white background) — never filled
- All borders default to `colors.border` (#E7EAF3)
- Never use borderRadius values outside the defined component tokens
