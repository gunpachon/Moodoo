import { ThemeProvider } from "@react-navigation/native";
import { router, Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import "../global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import { vars } from "nativewind";
import { MoodEntriesProvider } from "@/context/MoodEntriesContext";
import { darkNavigationTheme, lightNavigationTheme } from "@/constants/Themes";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const navigationTheme =
    colorScheme === "dark" ? darkNavigationTheme : lightNavigationTheme;
  const theme = useTheme();

  return (
    <ThemeProvider value={navigationTheme}>
      <MoodEntriesProvider>
        <Stack
          screenOptions={{
            headerBackTitle: "Back",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="record-mood"
            options={{
              title: "Record mood",
              presentation: "modal",
              headerLeft: () => {
                return (
                  <Button
                    title="Cancel"
                    style={vars(theme)}
                    contentClassName="text-lg font-medium"
                    onPress={() => router.dismiss()}
                  ></Button>
                );
              },
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </MoodEntriesProvider>
    </ThemeProvider>
  );
}
