import "../global.css";
import "react-native-reanimated";
import { Stack } from "expo-router";
import { useAppThemeName } from "@/hooks/use-app-theme-name";
import { SystemBars } from 'react-native-edge-to-edge';

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const appThemeName = useAppThemeName();

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        {/* <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} /> */}
      </Stack>

      <SystemBars style={appThemeName === "dark" ? "light" : "dark"} />
    </>
  );
}
