import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet } from "react-native";
import { colors } from "@/theme/tokens";
import { ReadingsIcon, FoodIcon, WorkoutIcon, SettingsIcon } from "@/components/ui/Icons";
import { DashboardScreen } from "@/features/glucose/screens/DashboardScreen";
import { AddReadingScreen } from "@/features/glucose/screens/AddReadingScreen";
import { HistoryScreen } from "@/features/glucose/screens/HistoryScreen";
import { FoodDashboardScreen } from "@/features/food/screens/FoodDashboardScreen";
import { SnapMealScreen } from "@/features/food/screens/SnapMealScreen";
import { ManualEntryScreen } from "@/features/food/screens/ManualEntryScreen";
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

type FoodStackParamList = {
  FoodHome: undefined;
  SnapMeal: undefined;
  ManualEntry: { photoUri?: string } | undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const GlucoseStack = createNativeStackNavigator<GlucoseStackParamList>();
const FoodStack = createNativeStackNavigator<FoodStackParamList>();

const TAB_ICONS: Record<string, typeof ReadingsIcon> = {
  Dashboard: ReadingsIcon,
  Food: FoodIcon,
  Workout: WorkoutIcon,
  Settings: SettingsIcon,
};

function TabIcon({ routeName, focused }: { routeName: string; focused: boolean }) {
  const IconComponent = TAB_ICONS[routeName];
  return (
    <View style={tabStyles.container}>
      <IconComponent
        size={22}
        color={focused ? colors.accent : colors.textMuted}
        strokeWidth={1.8}
      />
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
  },
});

function FoodStackNavigator() {
  return (
    <FoodStack.Navigator>
      <FoodStack.Screen
        name="FoodHome"
        component={FoodDashboardScreen}
        options={{ title: "Food" }}
      />
      <FoodStack.Screen
        name="SnapMeal"
        component={SnapMealScreen}
        options={{ title: "Snap Meal", presentation: "modal" }}
      />
      <FoodStack.Screen
        name="ManualEntry"
        component={ManualEntryScreen}
        options={{ title: "Manual Entry", presentation: "modal" }}
      />
    </FoodStack.Navigator>
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
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.borderLight,
            borderTopWidth: 1,
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
          },
          tabBarIcon: ({ focused }) => (
            <TabIcon routeName={route.name} focused={focused} />
          ),
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardStack} />
        <Tab.Screen name="Food" component={FoodStackNavigator} />
        <Tab.Screen name="Workout" component={WorkoutDashboardScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
