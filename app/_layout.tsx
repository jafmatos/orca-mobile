import "../global.css";
import "react-native-reanimated";
import { Stack } from "expo-router";
import { useAppThemeName } from "@/hooks/use-app-theme-name";
import { SystemBars } from "react-native-edge-to-edge";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const appThemeName = useAppThemeName();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/sign-up/index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/sign-up/confirm/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/reset-password/index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/reset-password/confirm/[id]" options={{ headerShown: false }} />
        {/* <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} /> */}
      </Stack>

      <SystemBars style={appThemeName === "dark" ? "light" : "dark"} />
    </QueryClientProvider>
  );
}
