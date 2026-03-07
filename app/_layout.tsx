import "../global.css";
import "react-native-reanimated";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider mode={colorScheme!}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        {/* <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} /> */}
      </Stack>

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} backgroundColor="transparent" translucent={true} />
    </GluestackUIProvider>
  );
}
