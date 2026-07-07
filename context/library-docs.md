# Library Docs

Project-specific usage patterns for every third party library in this project. This file only covers how we use each library in this specific project — rules, patterns, and constraints specific to YeZZ.

Read the relevant section before implementing any feature that touches these libraries.

---

## Before Using Any Library

Before implementing any feature that uses a third party library:

1. **Check AGENTS.md** at the project root — it lists every skill installed for this project and how to use them.

2. **Read this file** for project-specific patterns that override general library knowledge.

3. **Read the official docs** — library APIs change frequently and training data may be outdated.

The order of authority is:

```
Skills via AGENTS.md → This file (project rules) → Official library docs → General training knowledge
```

---

## expo-sqlite

**Check first:** Read the Expo docs at https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/ before using.

### Database Initialisation

```typescript
// db/database.ts
import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync("yezzi.db");
    await runMigrations(db);
  }
  return db;
}
```

### Sync API (Preferred)

```typescript
// Uses the newer sync API where possible
import * as SQLite from "expo-sqlite";

const db = await SQLite.openDatabaseAsync("yezzi.db");

// Run a query
await db.runAsync(
  "INSERT INTO glucose_readings (id, value, unit, type, date, time, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  [id, value, unit, type, date, time, notes, createdAt],
);

// Get all rows
const rows = await db.getAllAsync<GlucoseReading>(
  "SELECT * FROM glucose_readings WHERE date = ? ORDER BY time ASC",
  [date],
);

// Get first row
const row = await db.getFirstAsync<GlucoseReading>(
  "SELECT * FROM glucose_readings WHERE id = ?",
  [id],
);
```

### Migrations

```typescript
// db/migrations.ts
export async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS glucose_readings (
      id TEXT PRIMARY KEY,
      value REAL NOT NULL,
      unit TEXT NOT NULL CHECK(unit IN ('mg/dL', 'mmol/L')),
      type TEXT NOT NULL CHECK(type IN ('fasting', 'post_lunch')),
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_readings_date ON glucose_readings(date);
    CREATE INDEX IF NOT EXISTS idx_readings_type ON glucose_readings(type);
  `);
}
```

**Rules:**

- Always use parameterised queries — never concatenate values into SQL strings
- Always use `getDb()` from `db/database.ts` — never open a database directly in components
- All table creation goes in `db/migrations.ts` — never write raw CREATE TABLE in features
- Always index columns used in WHERE clauses (date, type, date + type)
- Use `TEXT` for dates and times (ISO format) — not SQLite date types
- Always wrap DB operations in try/catch in the service layer

---

## React Navigation

**Check first:** Read the React Navigation docs at https://reactnavigation.org/docs/getting-started/ before using.

### Navigator Setup

```typescript
// navigation/AppNavigator.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

type RootTabParamList = {
  Dashboard: undefined;
  Food: undefined;
  Workout: undefined;
  Settings: undefined;
};

type GlucoseStackParamList = {
  DashboardHome: undefined;
  AddReading: undefined;
  History: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const GlucoseStack = createNativeStackNavigator<GlucoseStackParamList>();
```

### Stack Screen

```typescript
// Within a tab
function DashboardStack() {
  return (
    <GlucoseStack.Navigator>
      <GlucoseStack.Screen
        name="DashboardHome"
        component={DashboardScreen}
        options={{ title: "Dashboard" }}
      />
      <GlucoseStack.Screen
        name="AddReading"
        component={AddReadingScreen}
        options={{ title: "Add Reading", presentation: "modal" }}
      />
      <GlucoseStack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: "History" }}
      />
    </GlucoseStack.Navigator>
  );
}
```

### Navigation Within a Screen

```typescript
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Nav = NativeStackNavigationProp<GlucoseStackParamList, "DashboardHome">;

function DashboardScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <Button
      title="Add Reading"
      onPress={() => navigation.navigate("AddReading")}
    />
  );
}
```

**Rules:**

- Always type your navigation param lists — never use untyped navigation
- Use `presentation: "modal"` for form screens that overlay
- Stack navigators hide the tab bar — use this for sub-screens
- Never nest navigators more than 2 levels deep
- Always use `NativeStackNavigationProp` type from `@react-navigation/native-stack`

---

## Victory Native (Charts)

**Check first:** Read the Victory Native docs at https://docs.page/FormidableLabs/victory-native before using.

### Trend Chart (14-day Glucose)

```tsx
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from "victory-native";

// Data points: { x: date string, y: value }
// Separate lines for fasting and post_lunch

<VictoryChart theme={VictoryTheme.material} domainPadding={10}>
  <VictoryLine
    data={fastingData}
    style={{ data: { stroke: "#7C5CFC", strokeWidth: 2 } }}
  />
  <VictoryLine
    data={postLunchData}
    style={{ data: { stroke: "#61A8FF", strokeWidth: 2 } }}
  />
  <VictoryAxis
    tickFormat={(t) => format(new Date(t), "MMM dd")}
    style={{ tickLabels: { fontSize: 10, padding: 5 } }}
  />
  <VictoryAxis dependentAxis
    label="mg/dL"
    style={{ tickLabels: { fontSize: 10 } }}
  />
</VictoryChart>
```

**Rules:**

- Always include both fasting and post-lunch lines on trend charts
- Fasting line color: `colors.accent` (#7C5CFC)
- Post-lunch line color: `colors.info` (#61A8FF)
- Normal range shown as a shaded band (optional, 70-140 mg/dL)
- X-axis always shows dates, Y-axis shows glucose values
- Never show more than 30 data points on a single chart — slice to 14 days

---

## date-fns

**Check first:** Read date-fns docs at https://date-fns.org/docs/Getting-Started.

### Date formatting

```typescript
import { format, formatDistanceToNow, startOfDay, subDays } from "date-fns";

// Display date as "Today", "Yesterday", or "MMM dd"
export function formatReadingDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = startOfDay(new Date());
  const readingDay = startOfDay(date);

  if (readingDay.getTime() === today.getTime()) return "Today";
  if (readingDay.getTime() === startOfDay(subDays(today, 1)).getTime()) return "Yesterday";
  return format(date, "MMM dd");
}

// Format time as "HH:mm"
export function formatReadingTime(timeStr: string): string {
  return timeStr; // already stored as HH:mm
}
```

**Rules:**

- Always import specific functions — never import the entire date-fns library
- Dates stored in DB as ISO strings — convert to Date objects for formatting
- Time stored separately as HH:mm string — no need to parse as Date

---

## expo-font

```typescript
// App.tsx or root layout
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return null;

  SplashScreen.hideAsync();
  return <NavigationContainer>{/* ... */}</NavigationContainer>;
}
```

**Rules:**

- Always load Inter on app start — never use system fonts
- Font weights require separate font files — never use `fontWeight` without loading the matching font
- Hide splash screen only after fonts are loaded
