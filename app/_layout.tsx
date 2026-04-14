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
import * as LucideIcons from "lucide-react-native";
import { IconProps } from "react-native-paper/lib/typescript/components/MaterialCommunityIcon";
import { PortalProvider } from "@gorhom/portal";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();

function LucideIconAdapter({ name, color, size }: IconProps) {
  const IconComponent = (LucideIcons as any)[name];

  return IconComponent ? <IconComponent color={color} size={size} /> : null;
}

export default function RootLayout() {
  useAxiosInterceptors();

  const appThemeName = useAppThemeName();
  const paperColors = appThemeName === "dark" ? paperDarkThemeColors : paperLightThemeColors;
  const paperTheme = appThemeName === "dark" ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider
      settings={{
        icon: (props) => <LucideIconAdapter {...props} />,
      }}
      theme={{
        ...paperTheme,
        colors: paperColors,
      }}
    >
      <KeyboardProvider>
        <PortalProvider>
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
        </PortalProvider>
      </KeyboardProvider>
    </PaperProvider>
  );
}
