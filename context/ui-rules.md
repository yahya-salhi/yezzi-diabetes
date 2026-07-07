# UI Rules

Concise rules for building YeZZ UI. These rules cover the most important patterns and constraints to keep the UI consistent and premium.

---

## Font

Always load Inter via `expo-font` in the root layout. Never use system fonts as the primary font.

```typescript
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
```

---

## Layout

- Screen max content width: safe area insets respected
- Screen padding: 20px on left and right (use `spacing.xl`)
- Gap between screen sections: 28px (use `spacing.xxl`)
- Top safe area respected for status bar
- Bottom tab bar height: 64px
- All screens scroll vertically by default
- Touch targets must be at least 44x44px

---

## Page Background

Page background is `colors.background` (#F4F2EE) — a warm off-white with subtle texture. Never use pure white (#FFF) or sterile light grey as page background.

---

## Navigation

- Bottom tab bar: Dashboard, Food, Workout, Settings
- Active tab: `colors.accent`, icon filled
- Inactive tab: `colors.textMuted`, icon outlined
- Stack screens push from right, no tab bar shown
- Modal screens slide from bottom for forms
- Tab bar uses actual icons (not text labels)

---

## Cards

Cards use subtle shadow for depth instead of border framing. No border on cards.

```
backgroundColor: colors.surface
borderRadius: 14
shadowColor: #000
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.04
shadowRadius: 8
elevation: 2
padding: 20
```

Never use colored card backgrounds — always white. Color goes inside cards via badges, bars, and text, never on the card surface itself.

---

## Typography Hierarchy

**Screen titles** — page headings
```
fontSize: 22
fontWeight: 600
color: colors.textPrimary
```

**Section headings** — card titles, section headers
```
fontSize: 17
fontWeight: 600
color: colors.textPrimary
```

**Body / primary content text**
```
fontSize: 15
fontWeight: 400
color: colors.textPrimary
```

**Secondary / muted text** — labels, timestamps, subtitles
```
fontSize: 13
fontWeight: 400
color: colors.textMuted
```

Stat numbers (glucose values, averages) use 34px / weight 700 / color `colors.textPrimary`.

---

## Badges

All badges use `borderRadius: 9999` (pill shape).

```
paddingVertical: 3
paddingHorizontal: 10
fontSize: 13
fontWeight: 500
```

---

## Buttons

**Primary button:**
```
backgroundColor: colors.accent
color: #FFFFFF
borderRadius: 10
paddingVertical: 12
paddingHorizontal: 20
fontSize: 15
fontWeight: 600
```

**Secondary button:**
```
backgroundColor: colors.surface
borderWidth: 1
borderColor: colors.border
color: colors.textPrimary
borderRadius: 10
paddingVertical: 12
paddingHorizontal: 20
fontSize: 15
fontWeight: 600
```

**Ghost button:**
```
backgroundColor: transparent
color: colors.accent
borderRadius: 10
paddingVertical: 12
paddingHorizontal: 16
fontSize: 15
fontWeight: 600
```

---

## Form Inputs

```
backgroundColor: colors.surface
borderWidth: 1
borderColor: colors.border
borderRadius: 10
paddingVertical: 14
paddingHorizontal: 20
fontSize: 15
color: colors.textPrimary
placeholder color: colors.textMuted
```

Focus state: `borderColor: colors.accent`.

---

## Glucose Reading Card Pattern

Each reading card follows this exact layout:

```
┌──────────────────────────────────────┐
│ █  Fasting             Today 08:30   │
│    128 mg/dL                         │
│    Above target — reduce carbs       │
└──────────────────────────────────────┘
```

- Left accent bar (4px wide, full height, rounded left) — green for normal, orange for borderline, red for high
- Reading type and time on the top row
- Reading value prominent (32px, weight 700, color-coded)
- Decision message below as secondary text (14px, 400)

---

## Decision Card Pattern

Color-coded card used for pattern alerts and threshold warnings:

```
┌─ [colored left accent bar] ──────────┐
│  ⚠ High Post-Meal Reading Detected   │
│  Your 2h post-lunch reading of 152   │
│  mg/dL is above 140 mg/dL target.    │
│                                       │
│  [View History]                       │
└───────────────────────────────────────┘
```

- Status icon on top line (checkmark / warning / alert)
- Title in bold, color-coded
- Body text below in textSecondary
- Action button when applicable

---

## Empty States

Every section that can be empty must have an empty state. Keep it minimal:

- Short descriptive text in `colors.textMuted` (15px)
- Optional icon above text (24px)
- CTA button if there's a logical next action

---

## Section Dividers

Use `spacing.xxl` (28px) between major screen sections. Use a thin divider line only when sections need stronger visual separation:

```
height: 1
backgroundColor: colors.borderLight
marginVertical: spacing.xxl
```

---

## Shadows

Use three shadow levels consistently:

- **shadowSm** — subtle lift for inline elements
- **shadowMd** — standard card depth (default)
- **shadowLg** — modal sheets, elevated states

---

## Do Nots

- Never use hardcoded hex values in components — use tokens from ui-tokens.md
- Never use borders on cards — use shadows instead
- Never add gradients to card backgrounds
- Never use more than one font weight in a single UI element
- Never show raw error messages to users — always show human readable text
- Never use `position: absolute` for layout — use flexbox
- Never nest ScrollViews
- Never use purple (#7C5CFC) — our accent is deep teal (#1B5E5A)
- Never use pure white (#FFFFFF) as page background — use #F4F2EE
- Never use `KeyboardAvoidingView` without testing on both platforms

---

## Elite Mobile UI Guarding Rules (Design Bible)

To maintain a premium, app-native, and highly art-directed visual identity for YeZZ, follow these strict design bible rules across all features:

### 1. Aesthetic Paradigm: Soft Wellness Neutral
- **Base Color Theme:** Muted, tactile, warm wellness palette. Page background is always `#F4F2EE` (warm clay/off-white) and primary container backgrounds are `#FFFFFF`.
- **Text Hierarchy:** Distinct contrast between typography weights (Inter Semibold for titles/headings, Inter Regular for body, Inter Medium/Semibold for actions and badges).
- **Layout Spacing:** Breathable spacing using `spacing.xl` (20px) for screen padding, `spacing.xxl` (28px) between major sections, and `spacing.md` (12px) for form inputs. Avoid cramming widgets.

### 2. Guarding against Generic AI Tells
- **No Purple-Blue Fintech Gradients:** Our core accent color is deep teal (`#1B5E5A`). Saturated purple, blue, or generic startup gradients are strictly forbidden.
- **No Card Clutter:** Never stack cards inside cards (box-in-box nesting). Use direct hierarchy and let elements breathe on the warm background.
- **No Random Glassmorphism:** Surfaces must feel solid, clean, and tactile. Refrain from using blurry translucent card overlays unless designing standard navigation sheets.

### 3. Media and Image Treatments
- **Fades & scrims behind text:** When displaying photos/images behind typography, protect legibility using an elegant bottom-to-top gradient fade to transparent, or soft overlays. Text must remain comfortably readable.
- **Aspect Ratio Control:** Always display images/photos in stable, fixed-media frames (e.g., aspect ratios of 1:1, 4:3, or 16:9). No messy scaling.

### 4. Custom Iconography & Asset Styling
- **Characterful & Restrained:** Icons must feel custom-designed and match the clean stroke/fill weight of the typography. Avoid generic developer-library icon sets.
- **Accents:** Use vector arcs, orbital lines, or grid motifs sparingly to enhance visual interest on screens. Keep them aligned with the deep teal brand color.
