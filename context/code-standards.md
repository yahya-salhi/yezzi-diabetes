# Code Standards

Implementation rules and conventions for the entire project. The AI agent must follow these in every session without exception. These rules prevent pattern drift across sessions.

---

## Engineering Mindset

The AI agent on this project operates as a senior engineer. This means:

- **Think before implementing** — understand what is being built and why before writing a single line
- **Read context files first** — never assume, always verify against architecture.md and project-overview.md
- **Scope is sacred** — only build what the current feature requires. Never go beyond scope even if it seems helpful
- **Every feature must be testable** — if it cannot be verified immediately after implementation, it is incomplete
- **Clean over clever** — simple readable code that a junior developer can understand is always preferred over clever abstractions
- **One thing at a time** — complete one feature fully before touching the next
- **Failures are expected** — wrap async operations in try/catch, log failures, never let one failure crash everything

---

## TypeScript

- Strict mode enabled in tsconfig.json — no exceptions
- Never use `any` — use `unknown` and narrow the type
- Never use type assertions (`as SomeType`) unless absolutely necessary and commented why
- All function parameters and return types must be explicitly typed
- Use `type` for object shapes and unions — use `interface` only for component props that extend native types
- All async functions must have proper error handling — never let promises float unhandled
- Use `const` by default — only use `let` when reassignment is necessary

---

## Expo React Native Conventions

- Expo SDK 54 — use Expo APIs over bare React Native where available
- React 19 — use React 19 APIs throughout
- Navigation: React Navigation (stack + bottom tabs)
- Styling: React Native StyleSheet only — no Tailwind, no styled-components
- All data access via custom hooks — never call SQLite directly in components
- Components are functional components with hooks — no class components
- Never use `useEffect` for data fetching — use custom hooks with `useFocusEffect` or manual triggers
- Screen components receive navigation params via typed props

---

## File and Folder Naming

- Folders: kebab-case for multi-word names — `glucose-log`, `food-diary` (single words like `glucose/`, `food/` are fine)
- Component files: PascalCase — `ReadingCard.tsx`, `AddReadingForm.tsx`
- Screen files: PascalCase — `DashboardScreen.tsx`, `HistoryScreen.tsx`
- Service files: camelCase — `readings.ts`, `averages.ts`
- Hook files: camelCase — `useReadings.ts`, `useAverages.ts`
- Type files: camelCase — `types.ts`
- One component per file — never export multiple components from one file
- Index files only in `features/` subfolders — never barrel export from other folders

---

## Component Structure

Every component follows this exact order:

```typescript
// 1. External imports
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

// 2. Internal imports
import { ReadingCard } from "@/features/glucose/components/ReadingCard";
import { colors, spacing } from "@/theme/tokens";

// 3. Type definitions
type Props = {
  reading: GlucoseReading;
  onPress?: (id: string) => void;
};

// 4. Component
export function ReadingCard({ reading, onPress }: Props) {
  // state
  // derived values
  // handlers
  // return JSX
}

// 5. Styles
const styles = StyleSheet.create({
  container: {
    // ...
  },
});
```

- Never use default exports for components — always named exports (exception: root `App.tsx` where Expo requires `export default`)
- Props type defined directly above the component — not in a separate types file unless shared
- No inline styles — all styling via StyleSheet
- Styles always at the bottom of the file, after the component

---

## Custom Hooks Pattern

Every data operation goes through a custom hook. Hooks return loading, error, and data:

```typescript
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getReadings } from "@/features/glucose/services/readings";

type UseReadingsResult = {
  readings: GlucoseReading[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useReadings(date?: string): UseReadingsResult {
  const [readings, setReadings] = useState<GlucoseReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReadings(date);
      setReadings(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [date]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { readings, loading, error, refresh: load };
}
```

---

## Service Layer Pattern

Each service file owns one table or one domain concern:

```typescript
// features/glucose/services/readings.ts
import { db } from "@/db/database";
import type { GlucoseReading, InsertReading } from "@/features/glucose/types";

export async function getReadings(date?: string): Promise<GlucoseReading[]> {
  if (date) {
    return await db.getAllAsync<GlucoseReading>(
      "SELECT * FROM glucose_readings WHERE date = ? ORDER BY time ASC",
      [date],
    );
  }
  return await db.getAllAsync<GlucoseReading>(
    "SELECT * FROM glucose_readings ORDER BY date DESC, time ASC",
  );
}

export async function insertReading(reading: InsertReading): Promise<void> {
  await db.runAsync(
    `INSERT INTO glucose_readings (id, value, unit, type, date, time, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [reading.id, reading.value, reading.unit, reading.type, reading.date, reading.time, reading.notes, reading.created_at],
  );
}
```

---

## Error Handling

- Never use empty catch blocks — always log or handle
- Console errors always include context prefix: `[service/hook name]`
- User-facing errors must be human readable — never expose raw error messages
- API/service errors are logged, never surfaced raw to the UI
- SQLite errors are always wrapped in try/catch — never let a DB error crash the app
- Show user-friendly error messages in a toast or inline alert

---

## Theme Tokens

All visual tokens are defined in `theme/tokens.ts`. Import and use everywhere:

```typescript
import { colors, typography, spacing } from "@/theme/tokens";

// Never hardcode hex values
style={{ backgroundColor: colors.surface, padding: spacing.lg }}
```

---

## Database

- expo-sqlite with synchronous API where possible
- All migrations in `db/migrations.ts` — never write raw SQL in components
- Every table has a `created_at` timestamp
- SQLite operations are always wrapped in try/catch
- Never use raw SQL strings in components — always go through services

---

## Imports

Always use the `@/` alias — never use relative imports that go up more than one level.

```typescript
// Correct
import { ReadingCard } from "@/features/glucose/components/ReadingCard";
import { colors } from "@/theme/tokens";
import { useReadings } from "@/features/glucose/hooks/useReadings";

// Never
import { ReadingCard } from "../../../features/glucose/components/ReadingCard";
```

---

## Comments

- No comments explaining what the code does — code must be self-explanatory
- Comments only for why — explaining a non-obvious decision
- Never leave TODO comments in committed code

---

## Dependencies

Never install a new package without a clear reason. Before installing anything check:

1. Does Expo already provide this functionality?
2. Is there a simpler native solution?

Approved dependencies for this project:

- `expo-sqlite` — Local database
- `expo-camera` — Camera capture for food photos
- `expo-file-system` — Save captured photos locally
- `@react-navigation/native` — Navigation container
- `@react-navigation/bottom-tabs` — Bottom tab navigator
- `@react-navigation/native-stack` — Stack navigator
- `react-native-screens` — Native screen containers
- `react-native-safe-area-context` — Safe area handling
- `@expo-google-fonts/inter` — Inter font
- `expo-font` — Font loading
- `react-native-gifted-charts` — Charts for trends
- `react-native-svg` — SVG rendering (required by react-native-gifted-charts)
- `expo-linear-gradient` — Gradients (required by react-native-gifted-charts)
- `date-fns` — Date formatting and calculations
- `uuid` — UUID generation for IDs
- `openai` — GPT-4o Vision via OpenRouter for food recognition + estimation
- `expo-sharing` — System share sheet for backup export
- `expo-document-picker` — File picker for backup restore
- `expo-notifications` — Local notifications for reading reminders

Do not install any other packages without updating this list first.
