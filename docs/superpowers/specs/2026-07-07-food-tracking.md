# Food Tracking & Blood Sugar Estimation — Feature 2

## Purpose
Allow users to log meals by taking a photo, get GPT-4o Vision-based food identification and nutrition estimation, link meals to post-lunch glucose readings, and surface insights about which foods cause the highest spikes.

## Data Model

New table `food_log`:

| Column            | Type     | Notes                                           |
| ----------------- | -------- | ----------------------------------------------- |
| id                | text     | UUID, primary key                               |
| reading_id        | text     | Nullable FK to glucose_readings                  |
| meal_type         | text     | 'breakfast', 'lunch', 'dinner', 'snack'          |
| date              | text     | ISO YYYY-MM-DD                                  |
| time              | text     | HH:mm                                           |
| photo_uri         | text     | Local file path to captured photo               |
| food_name         | text     | GPT-4o identified food name                     |
| carbs_g           | real     | Estimated total carbs in grams                  |
| protein_g         | real     | Estimated protein, nullable                     |
| fat_g             | real     | Estimated fat, nullable                         |
| estimated_impact  | real     | GPT-4o's estimated blood glucose rise (mg/dL)   |
| notes             | text     | Optional user notes                             |
| created_at        | text     | ISO timestamp                                   |

Add to `glucose_readings`: `food_log_id` text (nullable FK to food_log).

## Screens

Three new screens under the Food tab (stack navigator):

1. **FoodDashboardScreen** — Today's meals list, daily carbs/impact totals, quick "Snap a meal" FAB, recent meals presets strip.
2. **SnapMealScreen** — Full-screen camera view with capture button. After capture: loading state → review/edit screen with identified food, nutrition, impact. User edits fields, sets meal type, saves.
3. **MealDetailScreen** — Meal photo, nutrition breakdown, estimated impact, linked reading if any.
4. **ManualEntryScreen** — Fallback when camera fails. Text input for meal description, GPT-4o estimates same fields.

## GPT-4o Vision Flow

1. User captures photo → saved locally via expo-file-system
2. Photo converted to base64 → sent to GPT-4o Vision
3. Prompt: identify food, estimate carbs/protein/fat, estimate glucose impact in mg/dL
4. Response validated (JSON: `{ food_name, carbs_g, protein_g, fat_g, estimated_impact_mgdl }`)
5. User reviews, edits if needed, adds meal_type → saves
6. On parse failure → max 2 retries → fallback to manual text entry

**Temperature:** 0.3. **Model:** gpt-4o.

## Meal-to-Reading Linking

When user logs a post-lunch glucose reading:
- App checks for lunch food_log entries today → suggests link
- If accepted: `glucose_readings.food_log_id` → `food_log.id`
- Dashboard shows actual vs estimated impact for linked pairs

## Architecture

```
features/food/
├── screens/          → FoodDashboardScreen, SnapMealScreen, MealDetailScreen, ManualEntryScreen
├── components/       → MealCard, CameraView, NutritionBreakdown, EstimatedImpactBadge, MealLinkSuggestion
├── services/         → foodLog.ts (CRUD), mealAnalysis.ts (GPT-4o Vision), impactEstimator.ts (link & compare)
├── hooks/            → useFoodLog, useMealAnalysis
└── types.ts
```

**New dependencies:** expo-camera, expo-file-system, openai.

## Out of Scope (Feature 2)
- Barcode scanning
- Recipe import
- Cloud photo backup
- Full food database search
- Meal planning / calendar
