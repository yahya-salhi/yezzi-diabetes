import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import { colors } from "@/theme/tokens";
import { DashboardScreen } from "@/features/glucose/screens/DashboardScreen";
import { AddReadingScreen } from "@/features/glucose/screens/AddReadingScreen";
import { HistoryScreen } from "@/features/glucose/screens/HistoryScreen";
import { FoodDashboardScreen } from "@/features/food/screens/FoodDashboardScreen";
import { WorkoutDashboardScreen } from "@/features/exercise/screens/WorkoutDashboardScreen";
import { SettingsScreen } from "@/features/settings/screens/SettingsScreen";

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

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontSize: 10,
        fontWeight: "500",
        color: focused ? colors.accent : colors.textMuted,
      }}
    >
      {label}
    </Text>
  );
}

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

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: { height: 60 },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Dashboard" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Food"
          component={FoodDashboardScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Food" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Workout"
          component={WorkoutDashboardScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Workout" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon label="Settings" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
