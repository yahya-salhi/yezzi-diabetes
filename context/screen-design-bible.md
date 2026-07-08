# YeZZi — 6-Screen Premium iOS Design Bible (Decision Record)

Decision document only. No code or component changes. Locks the art direction for the
6-screen premium iOS concept set: Dashboard → Add Reading → History → Food Log →
Exercise → Settings. All decisions align with `theme/tokens.ts`, `ui-tokens.md`,
`ui-rules.md`, and `ui-registry.md` — those files remain the source of truth.

---

## Platform Mode

**iOS-native premium.** Large-title top areas, calm hierarchy, native-feeling sheets
(Add Reading presented as a modal sheet), bottom tab bar (Dashboard / Food / Workout /
Settings), safe areas and home indicator respected on every screen.

---

## Design Bible (locked for all 6 screens)

### Palette — warm neutral base + deep teal, clinical-warm

- Background: warm off-white `#F4F2EE` — never pure white, never sterile grey
- Surfaces: white `#FFFFFF` cards on the warm base; secondary surface `#FAF9F7`
- Accent: deep teal `#1B5E5A` (primary CTAs, active tab, selected states);
  light teal `#E8F0EF` for selected chips and soft fills
- Semantic status trio does the real work: in-range green `#1B8A5A`,
  borderline amber `#B8860B`, above-target red `#C5304B`; info blue `#4E7FA7`
  reserved for chart lines and informational cards only
- Text: near-black `#1A1D1C`, secondary `#6B6E6D`, muted `#A1A4A3`
- Palette logic: restrained warm monochrome + one working accent (teal).
  Status colors appear as thin accent bars and value tints — never as filled
  alarm blocks. Explicitly banned: purple-blue gradients, neon, glassmorphism.

### Texture — ultra-subtle warm grain

- Faint paper-like grain on the `#F4F2EE` background only (≈2–3% strength)
- Cards stay clean matte white with soft diffuse shadows (opacity 0.03–0.06)
- No noise on cards, text areas, or imagery; texture supports warmth, never competes

### Imagery — real-life warm photography, food-led only

- Photography appears only where it carries meaning: meal photo cards on Food Log
- Treatment: natural daylight, warm tone, slightly overhead food crops;
  consistent 4:3 thumbnails in the carousel shelf, radius 14, no borders
- Bottom-up soft scrim on photo cards where carb/impact labels overlay the image
- No stock lifestyle filler, no abstract hero blobs, no imagery on data screens

### Typography — Inter, disciplined product sans

- Single family: Inter (400 / 500 / 600 / 700), loaded via expo-font
- Locked scale: stat number 34/700 · reading value 32/700 (status-tinted) ·
  screen title 22/600 · section heading 17/600 · body 15/400 · card label 14/500 ·
  timestamp 13/400. Nothing below 12px anywhere.
- Numbers are the heroes: glucose values and averages get the large weights;
  everything else stays quiet around them

### Iconography — custom-feeling rounded line set

- 1.8px stroke, rounded caps and joins, 24px grid, single-color
- Character over library-default: droplet-with-check for readings, fork-and-leaf
  for food, calm dumbbell for exercise, sliders for settings, gentle flame for streaks
- Inactive: `#6B6E6D`; active/selected: teal `#1B5E5A`; never mixed weights,
  no generic Lucide-default feel, no emoji as UI icons in final art

### Corners — two-tier radius logic

- Cards, photo frames, alert cards: 14
- Buttons, inputs, toggles, segmented controls: 10
- Badges and status pills: fully rounded (999)
- No other radius values; no oversized 30px+ corners

### Navigation — tab bar + stacks + one modal sheet

- 64px bottom tab bar, 4 tabs: Dashboard · Food · Workout · Settings
- History pushed within the Dashboard stack (back chevron, stack feel)
- Add Reading rises as a modal sheet from Dashboard's primary CTA
- One primary action per screen; teal reserved for it

### Signature components (exactly 4)

1. **Glucose reading card** — white card, 4px left status bar, 32/700 status-tinted
   value + unit, type label, timestamp. The product's identity component.
2. **Rolling-average stat strip** — compact horizontal strip of 7/14/30/90-day
   averages, 34/700 numbers, quiet labels beneath.
3. **Pattern alert card** — outlined-feel white card with left status bar and
   short factual message ("3 high fasting readings — check your evening routine").
4. **Photo-led meal card** — 4:3 warm food photo, soft bottom scrim, carb estimate
   and impact chip; repeated in a horizontal carousel shelf.

### Decorative assets (exactly 2)

1. **Dotted arc accents** — thin dotted arcs (border-color tone `#E3DFD8`)
   framing the target-range zone on charts and the streak badge on Exercise
2. **Mini geometric markers** — small teal dots/ticks as timeline markers in
   History and milestone tiles in Exercise; never decorative-only clutter

### Motion-implied language (exactly 2)

- Sheet-rise energy (Add Reading modal caught mid-settle)
- Staggered list reveal calmness (History and Dashboard reading lists)

---

## Per-Screen Direction

1. **Dashboard** — calmest screen. Large "Today" title, one hero glucose reading
   card (latest reading, status bar + "In range" line), a small in-range summary
   ("Good range this week"), 2–3 of today's readings, single teal "Add reading" CTA.
   One focal point; no widget spam, no chart on first viewport.
2. **Add Reading** — modal sheet, lightest screen in the set. Date/time rows,
   5-option type control (fasting / pre-meal / post-meal / bedtime / other) as
   light-teal selectable chips, oversized value input with mg/dL ↔ mmol/L toggle,
   optional notes field, one full-width teal "Save reading" CTA. Zero decoration.
3. **History** — densest screen, list-led. Rolling-average stat strip pinned under
   the title, 1–2 pattern alert cards pinned above the list, filter chips (type +
   date range), then scannable reading cards grouped by day with mini geometric
   timeline markers. Density is earned here; spacing still per token scale.
4. **Food Log** — the imagery screen. Horizontal carousel shelf of photo-led meal
   cards, "Highest Spikes This Week" insight block (info-blue accent bar), prominent
   72px teal camera capture button. Warm, appetizing, still structured.
5. **Exercise** — motivating but calm. Weekly template card (PPL / Upper-Lower),
   recent workout summary cards, streak badge with dotted-arc accent, milestone
   tile row. No fitness-bro energy: quiet copy ("Week 3 · on plan"), no shouting.
6. **Settings** — lowest visual weight. Grouped white list cells (units, target
   range thresholds, appearance, data), 13px muted section headers, chevrons and
   toggles only. Teal appears only on active toggle states.

---

## Mockup & Consistency Rules

- Clean iPhone frame, thin dark bezel, soft diffuse shadow; identical device scale
  and even canvas margins across all 6 images; warm-neutral canvas behind the phone
- Copy tone locked: quiet, factual, reassuring — "Fasting 98 mg/dL ✓ In range",
  "2h post-meal 142 mg/dL ⚠ Above target", "No readings today"
- Banned across the set: purple-blue palettes, glassmorphism, floating card stacks,
  fake chart spam, generic icons, filler health copy, text under 12px, sterile flat
  backgrounds, fintech/startup vibes
- Every screen must read as the same product: same palette, type rhythm, radius
  logic, card language, icon set, and mockup framing. Vary composition and density
  per screen (Dashboard calmest → History densest), never the design system.
