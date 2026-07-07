# UI Tokens

Design tokens for YeZZ. All colors, typography, spacing, and component values defined here. Use these exact values throughout the codebase — never hardcode colors or use raw values in components.

---

## How to Use

This project uses React Native `StyleSheet` for styling. Import tokens from `@/theme/tokens`.

```typescript
import { colors, typography, spacing } from "@/theme/tokens";

style={[styles.card, { backgroundColor: colors.surface }]}
```

Never use hex values directly in components — always reference `colors.*` tokens.

---

## Color Palette

### Brand Philosophy

YeZZ uses a warm, premium health palette built around deep teal (`accent`) and warm off-white (`background`). This palette signals trust, calm, and human-centered care — distinct from cold clinical blues or generic purple health apps.

### Page Layout

| Element           | Token              | Hex       |
| ----------------- | ------------------ | --------- |
| Page background   | `colors.background`| #F4F2EE   |
| Card / surface    | `colors.surface`   | #FFFFFF   |
| Secondary surface | `colors.surfaceSecondary` | #FAF9F7 |

### Text

| Element                | Token              | Hex       |
| ---------------------- | ------------------ | --------- |
| Headings, primary text | `colors.textPrimary` | #1A1D1C   |
| Secondary text, labels | `colors.textSecondary` | #6B6E6D |
| Placeholder, muted     | `colors.textMuted` | #A1A4A3   |

### Accent & Semantic Colors

| Token              | Hex       | Usage                              |
| ------------------ | --------- | ---------------------------------- |
| `colors.accent`    | #1B5E5A   | Primary buttons, active states     |
| `colors.accentLight` | #E8F0EF | Light accent for selected chips    |
| `colors.success`   | #1B8A5A   | Normal readings, good trends       |
| `colors.warning`   | #B8860B   | Borderline readings                |
| `colors.error`     | #C5304B   | High readings, alerts              |
| `colors.info`      | #4E7FA7   | Informational cards, chart lines   |

### Borders

| Token             | Hex       |
| ----------------- | --------- |
| `colors.border`   | #E3DFD8   |
| `colors.borderLight` | #EDEAE4 |

---

## Typography

Font family: **Inter** (loaded via `expo-font`). Never use system font fallback.

| Element              | Size | Weight | Line height | Color                    |
| -------------------- | ---- | ------ | ----------- | ------------------------ |
| Stat number          | 34px | 700    | 40px        | `colors.textPrimary`     |
| Reading value        | 32px | 700    | 38px        | varies by status         |
| Screen title         | 22px | 600    | 30px        | `colors.textPrimary`     |
| Section heading      | 17px | 600    | 24px        | `colors.textPrimary`     |
| Body text            | 15px | 400    | 22px        | `colors.textPrimary`     |
| Card label           | 14px | 500    | 20px        | `colors.textSecondary`   |
| Timestamp / muted    | 13px | 400    | 18px        | `colors.textMuted`       |
| Badge text           | 13px | 500    | 18px        | varies by type           |
| Button label         | 15px | 600    | 20px        | varies by variant        |
| Small / caption      | 12px | 400    | 16px        | `colors.textMuted`       |

---

## Spacing

| Token      | Value | Usage                        |
| ---------- | ----- | ---------------------------- |
| `spacing.xs`  | 4px   | Tight inline gaps            |
| `spacing.sm`  | 8px   | Badge and tag gaps           |
| `spacing.md`  | 12px  | Form field gaps              |
| `spacing.lg`  | 16px  | Section internal gaps        |
| `spacing.xl`  | 20px  | Card padding, between items  |
| `spacing.xxl` | 28px  | Between sections             |
| `spacing.xxxl`| 36px  | Page padding, hero spacing   |

---

## Component Tokens

### Cards

```
backgroundColor: colors.surface
borderRadius: 14
shadowColor: #000
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.04
shadowRadius: 8
elevation: 2
padding: spacing.xl
```

No border on cards — use subtle shadow for depth instead of box-in-box framing.

### Buttons

**Primary:**
```
backgroundColor: colors.accent
color: #FFFFFF
borderRadius: 10
paddingVertical: 12
paddingHorizontal: spacing.xl
```

**Secondary:**
```
backgroundColor: colors.surface
borderWidth: 1
borderColor: colors.border
color: colors.textPrimary
borderRadius: 10
paddingVertical: 12
paddingHorizontal: spacing.xl
```

**Ghost:**
```
backgroundColor: transparent
color: colors.accent
paddingVertical: 12
paddingHorizontal: spacing.lg
```

All buttons: `fontSize: 15, fontWeight: 600`.

### Input Fields

```
backgroundColor: colors.surface
borderWidth: 1
borderColor: colors.border
borderRadius: 10
paddingVertical: 14
paddingHorizontal: spacing.lg
fontSize: 15
color: colors.textPrimary
```

Focus state: `borderColor: colors.accent`.

### Badges

```
borderRadius: 999
paddingVertical: 3
paddingHorizontal: 10
fontSize: 13
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
Reading value:     32px, weight 700, color-coded by status
Reading label:     13px, weight 400, color textMuted
Status indicator:  Left accent bar (4px width), color-coded (success / warning / error)
Card padding:      spacing.xl
Border radius:     14
```

### Section Divider

```
height: 1
backgroundColor: colors.borderLight
marginVertical: spacing.xxl
```

---

## Shadow Tokens

```
shadowSm: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.03,
  shadowRadius: 4,
  elevation: 1,
}

shadowMd: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.04,
  shadowRadius: 8,
  elevation: 2,
}

shadowLg: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 12,
  elevation: 4,
}
```

---

## Invariants

- Never use hex values directly in components — always reference `colors.*` tokens
- Font is Inter — always load via expo-font, never use system font fallback
- Glucose reading cards always use left-bar color coding for status
- Decision cards are always outlined (colored border, white background) — never filled
- Cards use shadows, not borders, for depth — no border on cards unless explicitly needed
- Background is always `colors.background` (#F4F2EE) — never pure white or sterile grey
- Never use borderRadius values outside the defined component tokens
- Buttons have 10px radius — consistent across primary, secondary, and ghost variants
- Touch targets must be at least 44px in both dimensions (iOS HIG)
- Saturated colors must be reserved for status/accents — main canvases stay quiet and neutral
- Aspect ratios for visual content must be locked (no squished/stretched images)
- All navigation tabs use consistent iconography without text labels
