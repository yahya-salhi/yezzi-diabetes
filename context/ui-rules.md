# UI Rules

Concise rules for building YeZZ UI. These rules cover the most important patterns and constraints to keep the UI consistent.

---

## Font

Always load Inter via `expo-font` in the root layout. Never use system fonts as the primary font.

```typescript
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
```

---

## Layout

- Screen max content width: safe area insets respected
- Screen padding: 16px on left and right (use `spacing.lg`)
- Gap between screen sections: 24px (use `spacing.xl`)
- Top safe area respected for status bar
- Bottom tab bar height: 60px
- All screens scroll vertically by default

---

## Navigation

- Bottom tab bar: Dashboard, Food, Workout, Settings
- Active tab: `colors.accent`, icon filled
- Inactive tab: `colors.textMuted`, icon outlined
- Stack screens push from right, no tab bar shown
- Modal screens slide from bottom for forms

---

## Cards

Every content section lives in a card.

```
backgroundColor: colors.surface
borderWidth: 1
borderColor: colors.border
borderRadius: 16
padding: 24
```

Never use colored card backgrounds — always white. Color goes inside cards via badges, bars, and text, never on the card surface itself.

---

## Typography Hierarchy

**Screen titles** — page headings

```
fontSize: 20
fontWeight: 600
color: colors.textPrimary
```

**Section headings** — card titles, section headers

```
fontSize: 16
fontWeight: 600
color: colors.textPrimary
```

**Body / primary content text**

```
fontSize: 14
fontWeight: 400
color: colors.textPrimary
```

**Secondary / muted text** — labels, timestamps, subtitles

```
fontSize: 12
fontWeight: 400
color: colors.textMuted
```

Stat numbers (glucose values, averages) use 30px / weight 700 / color `colors.textPrimary`.

---

## Badges

All badges use `borderRadius: 9999` (pill shape).

```
paddingVertical: 2
paddingHorizontal: 8
fontSize: 12
fontWeight: 500
```

---

## Buttons

**Primary button:**

```
backgroundColor: colors.accent
color: colors.surface
borderRadius: 8
paddingVertical: 8
paddingHorizontal: 16
fontSize: 14
fontWeight: 500
```

**Secondary button:**

```
backgroundColor: colors.surface
borderWidth: 1
borderColor: colors.border
color: colors.textPrimary
borderRadius: 8
paddingVertical: 8
paddingHorizontal: 16
```

---

## Form Inputs

```
backgroundColor: colors.surface
borderWidth: 1
borderColor: colors.border
borderRadius: 8
paddingVertical: 8
paddingHorizontal: 12
fontSize: 14
color: colors.textPrimary
placeholder color: colors.textMuted
```

---

## Glucose Reading Card Pattern

Each reading card follows this exact layout:

```
┌──────────────────────────────────────┐
│ ○  Fasting          Today 08:30      │
│   128 mg/dL                          │
│   Above target — consider reducing   │
│   carbs at dinner                    │
└──────────────────────────────────────┘
```

- Left color strip (4px wide, full height) — green for normal, orange for borderline, red for high
- Reading type and time on the top row
- Reading value prominent (28px, weight 700)
- Decision message below as secondary text

---

## Decision Card Pattern

Color-coded card that appears below readings or on dashboard:

```
┌─ [colored left border] ─────────────┐
│  ▲ High Post-Meal Reading Detected  │
│  Your 2h post-lunch reading of 152  │
│  mg/dL is above the 140 mg/dL       │
│  target. Consider reducing carb     │
│  portions at lunch.                 │
└─────────────────────────────────────┘
```

- Status icon on top line (checkmark / warning / alert)
- Title in bold
- Body text below
- Action button when applicable ("View History", "Log Food")

---

## Empty States

Every section that can be empty must have an empty state. Keep it minimal:

- Short descriptive text in `colors.textMuted`
- Optional icon above text
- CTA button if there's a logical next action

---

## Do Nots

- Never use hardcoded hex values in components — use tokens from ui-tokens.md
- Never add gradients to card backgrounds
- Never use more than one font weight in a single UI element
- Never show raw error messages to users — always show human readable text
- Never use `position: absolute` for layout — use flexbox
- Never nest ScrollViews
- Never use `KeyboardAvoidingView` without testing on both platforms
