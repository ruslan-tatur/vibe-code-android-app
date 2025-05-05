import { SplashScreen, Stack } from "expo-router";
import { DatabaseProvider } from "./providers/database-provider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </DatabaseProvider>
  );
}
