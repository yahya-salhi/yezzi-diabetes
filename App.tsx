import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { Platform, View, StyleSheet } from "react-native";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "@/navigation/AppNavigator";
import { OnboardingScreen } from "@/features/onboarding/screens/OnboardingScreen";
import { getPreferences } from "@/features/onboarding/services/preferences";
import { RepoProvider, useGlucoseReadings } from "@/features/repos/RepoContext";
import { createSqliteReminderStorage } from "@/features/reminders/services/reminderStorage";
import { createNotificationScheduler, createSkipHandler } from "@/features/reminders/services/notificationScheduler";
import { colors } from "@/theme/tokens";
import { REVENUECAT_API_KEY } from "@/config";
import { setSubscriptionService } from "@/features/plus/services/subscription";
import { createRevenueCatAdapter } from "@/features/plus/services/revenueCatAdapter";
import { PaywallProvider } from "@/features/plus/components/PaywallProvider";

SplashScreen.preventAutoHideAsync();

function NotificationInit() {
  const glucoseReadings = useGlucoseReadings();

  useEffect(() => {
    async function setup() {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("reading-reminders", {
          name: "Reading Reminders",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: colors.accent,
        });
      }

      Notifications.setNotificationHandler({
        handleNotification: createSkipHandler(glucoseReadings),
      });

      const storage = createSqliteReminderStorage();
      const prefs = await storage.getAll();
      const scheduler = createNotificationScheduler(glucoseReadings);
      await scheduler.scheduleAll(prefs);
    }
    setup();
  }, [glucoseReadings]);

  return null;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const apiKey = Platform.OS === "ios" ? REVENUECAT_API_KEY.ios : REVENUECAT_API_KEY.android;
        const adapter = createRevenueCatAdapter(apiKey, __DEV__);
        setSubscriptionService(adapter);

        const prefs = await getPreferences();
        setShowOnboarding(!prefs);
      } catch (err) {
        console.error("[app] init failed", err);
        setShowOnboarding(true);
      } finally {
        setReady(true);
      }
    }
    init();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && ready) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, ready]);

  if (!fontsLoaded || !ready) return null;

  return (
    <RepoProvider>
      <NavigationContainer>
        <NotificationInit />
        <PaywallProvider>
          <View style={styles.root} onLayout={onLayoutRootView}>
            <StatusBar style="dark" />
            {showOnboarding ? (
              <OnboardingScreen onComplete={() => setShowOnboarding(false)} />
            ) : (
              <AppNavigator />
            )}
          </View>
        </PaywallProvider>
      </NavigationContainer>
    </RepoProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
