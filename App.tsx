import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { AppNavigator } from "@/navigation/AppNavigator";
import { OnboardingScreen } from "@/features/onboarding/screens/OnboardingScreen";
import { getPreferences } from "@/features/onboarding/services/preferences";
import { RepoProvider } from "@/features/repos/RepoContext";

SplashScreen.preventAutoHideAsync();

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
      <View style={styles.root} onLayout={onLayoutRootView}>
        <StatusBar style="dark" />
        {showOnboarding ? (
          <OnboardingScreen onComplete={() => setShowOnboarding(false)} />
        ) : (
          <AppNavigator />
        )}
      </View>
    </RepoProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
