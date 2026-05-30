import "../global.css";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { Stack } from "expo-router";
import { useAppThemeName } from "@/hooks/use-app-theme-name";
import { SystemBars } from "react-native-edge-to-edge";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAxiosInterceptors } from "@/hooks/use-axios-interceptors";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { paperDarkThemeColors } from "@/themes/paper-dark-theme-colors";
import { paperLightThemeColors } from "@/themes/paper-light-theme-colors";
import { configureFonts, MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { PortalProvider } from "@gorhom/portal";
import { BottomSheetProvider } from "jam-bottomsheet";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();

export default function RootLayout() {
  useAxiosInterceptors();

  const [loaded, error] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const appThemeName = useAppThemeName();
  const paperColors = appThemeName === "dark" ? paperDarkThemeColors : paperLightThemeColors;
  const paperTheme = appThemeName === "dark" ? MD3DarkTheme : MD3LightTheme;

  if (!loaded && !error) {
    return null;
  }

  const customFonts = Object.fromEntries(
    Object.entries(paperTheme.fonts).map(([variant, config]) => {
      let fontFamily = "Inter-Regular";
      if (config.fontWeight === "500") fontFamily = "Inter-Medium";
      if (config.fontWeight === "600") fontFamily = "Inter-SemiBold";
      if (config.fontWeight === "700" || config.fontWeight === "bold") fontFamily = "Inter-Bold";

      return [variant, { ...config, fontFamily }];
    }),
  ) as typeof paperTheme.fonts;

  return (
    <PaperProvider
      theme={{
        ...paperTheme,
        dark: appThemeName === "dark",
        colors: paperColors,
        fonts: customFonts,
      }}
    >
      <KeyboardProvider>
        <PortalProvider>
          <BottomSheetProvider>
            <QueryClientProvider client={queryClient}>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)/sign-in" />
                <Stack.Screen name="(auth)/sign-up/index" />
                <Stack.Screen name="(auth)/sign-up/confirm/[id]" />
                <Stack.Screen name="(auth)/reset-password/index" />
                <Stack.Screen name="(auth)/reset-password/confirm/[id]" />
              </Stack>

              <SystemBars style={appThemeName === "dark" ? "light" : "dark"} />
            </QueryClientProvider>
          </BottomSheetProvider>
        </PortalProvider>
      </KeyboardProvider>
    </PaperProvider>
  );
}
