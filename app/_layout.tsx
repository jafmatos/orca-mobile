import "../global.css";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import { Stack, usePathname } from "expo-router";
import { ThemeProvider, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { isAxiosError } from "axios";
import { useAppThemeName } from "@/hooks/use-app-theme-name";
import { SystemBars } from "react-native-edge-to-edge";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAxiosInterceptors } from "@/hooks/use-axios-interceptors";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { paperDarkThemeColors } from "@/themes/paper-dark-theme-colors";
import { paperLightThemeColors } from "@/themes/paper-light-theme-colors";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { PortalHost, PortalProvider } from "@gorhom/portal";
import { BottomSheetProvider } from "jam-bottomsheet";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { useEffect, useMemo } from "react";
import { AppToast } from "@/components/utils/AppToast";
import * as SystemUI from "expo-system-ui";
import { MODAL_ROUTES, ROUTES } from "@/hooks/use-app-router";
import { StatusBar } from "expo-status-bar";
import { useAppTheme } from "@/hooks/use-app-theme";

SplashScreen.preventAutoHideAsync();

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (!isAxiosError(error)) return failureCount < 3;
        if (error.response?.status === 401) return false;

        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

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

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(paperColors.background);
  }, [paperColors.background]);

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

  const reactNavigationTheme = {
    ...(appThemeName === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(appThemeName === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      background: paperColors.background,
    },
  };

  return (
    <ThemeProvider value={reactNavigationTheme}>
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
                    contentStyle: { backgroundColor: paperColors.background },
                  }}
                >
                  <Stack.Screen name={ROUTES.tabs.name} />
                  <Stack.Screen name={ROUTES.signIn.name} />
                  <Stack.Screen name={ROUTES.signUp.name} />
                  <Stack.Screen name={ROUTES.signUpConfirm.name} />
                  <Stack.Screen name={ROUTES.resetPassword.name} />
                  <Stack.Screen name={ROUTES.resetPasswordConfirm.name} />
                  <Stack.Screen name={MODAL_ROUTES.categoryForm.name} options={{ presentation: "modal" }} />
                  <Stack.Screen name={MODAL_ROUTES.entryManualForm.name} options={{ presentation: "modal" }} />
                  <Stack.Screen name={MODAL_ROUTES.entrySmartForm.name} options={{ presentation: "modal" }} />
                  <Stack.Screen name={MODAL_ROUTES.entrySearch.name} options={{ presentation: "modal" }} />
                  <Stack.Screen name={MODAL_ROUTES.scheduleForm.name} options={{ presentation: "modal" }} />
                  <Stack.Screen name={MODAL_ROUTES.profileForm.name} options={{ presentation: "modal" }} />
                  <Stack.Screen name={MODAL_ROUTES.billingPortal.name} options={{ presentation: "modal" }} />
                  <Stack.Screen name={MODAL_ROUTES.plans.name} options={{ presentation: "modal" }} />
                  <Stack.Screen name={MODAL_ROUTES.subscriptionSuccess.name} options={{ presentation: "modal" }} />
                  <Stack.Screen name={MODAL_ROUTES.settings.name} options={{ presentation: "modal" }} />
                  <Stack.Screen name={MODAL_ROUTES.chatAssistant.name} options={{ presentation: "modal" }} />
                </Stack>

                <PortalHost name="select" />

                <RootStatusBar />

                <AppToast />
              </QueryClientProvider>
            </BottomSheetProvider>
          </PortalProvider>
        </KeyboardProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}

function RootStatusBar() {
  const appThemeName = useAppThemeName();
  const pathname = usePathname();
  const isHomeScreen = useMemo(() => pathname === "/" || pathname === "", [pathname]);

  return <StatusBar style={isHomeScreen || appThemeName === "dark" ? "light" : "dark"} translucent />;
}
