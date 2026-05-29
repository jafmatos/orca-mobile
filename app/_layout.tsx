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
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
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
      console.log("Fonts loaded", loaded, error);
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const appThemeName = useAppThemeName();
  const paperColors = appThemeName === "dark" ? paperDarkThemeColors : paperLightThemeColors;
  const paperTheme = appThemeName === "dark" ? MD3DarkTheme : MD3LightTheme;

  if (!loaded && !error) {
    return null;
  }

  return (
    <PaperProvider
      theme={{
        ...paperTheme,
        dark: appThemeName === "dark",
        colors: paperColors,
        fonts: {
          ...paperTheme.fonts,
          bodyLarge: { ...paperTheme.fonts.bodyLarge, fontFamily: "Inter-Regular", fontWeight: "400" },
          bodyMedium: { ...paperTheme.fonts.bodyMedium, fontFamily: "Inter-Regular", fontWeight: "400" },
          bodySmall: { ...paperTheme.fonts.bodySmall, fontFamily: "Inter-Regular", fontWeight: "400" },
          labelLarge: { ...paperTheme.fonts.labelLarge, fontFamily: "Inter-Medium", fontWeight: "500" },
          labelMedium: { ...paperTheme.fonts.labelMedium, fontFamily: "Inter-Medium", fontWeight: "500" },
          labelSmall: { ...paperTheme.fonts.labelSmall, fontFamily: "Inter-Medium", fontWeight: "500" },
          titleLarge: { ...paperTheme.fonts.titleLarge, fontFamily: "Inter-SemiBold", fontWeight: "600" },
          titleMedium: { ...paperTheme.fonts.titleMedium, fontFamily: "Inter-Medium", fontWeight: "500" },
          titleSmall: { ...paperTheme.fonts.titleSmall, fontFamily: "Inter-Medium", fontWeight: "500" },
          headlineLarge: { ...paperTheme.fonts.headlineLarge, fontFamily: "Inter-Bold", fontWeight: "700" },
          headlineMedium: { ...paperTheme.fonts.headlineMedium, fontFamily: "Inter-SemiBold", fontWeight: "600" },
          headlineSmall: { ...paperTheme.fonts.headlineSmall, fontFamily: "Inter-Medium", fontWeight: "500" },
          displayLarge: { ...paperTheme.fonts.displayLarge, fontFamily: "Inter-Bold", fontWeight: "700" },
          displayMedium: { ...paperTheme.fonts.displayMedium, fontFamily: "Inter-Bold", fontWeight: "700" },
          displaySmall: { ...paperTheme.fonts.displaySmall, fontFamily: "Inter-Bold", fontWeight: "700" },
        },
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
