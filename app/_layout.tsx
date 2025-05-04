import { SplashScreen, Stack } from "expo-router";
import { initializeDatabase } from "./data/goals-service";
import { useEffect, useState } from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await initializeDatabase();

        setLoaded(true);

        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Failed to initialize database:', error);

        setLoaded(true);

        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!loaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
