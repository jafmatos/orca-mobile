import "../global.css";
import "react-native-reanimated";
import { Stack } from "expo-router";
import { useAppThemeName } from "@/hooks/use-app-theme-name";
import { SystemBars } from "react-native-edge-to-edge";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAxiosInterceptors } from "@/hooks/use-axios-interceptors";

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();

export default function RootLayout() {
  useAxiosInterceptors();

  const appThemeName = useAppThemeName();

  return (
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
        {/* <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} /> */}
      </Stack>

      <SystemBars style={appThemeName === "dark" ? "light" : "dark"} />
    </QueryClientProvider>
  );
}
