import { darkThemeColors, darkThemeVars } from "@/themes/tailwind-dark-theme-vars";
import { lightThemeColors, lightThemeVars } from "@/themes/tailwind-light-theme-vars";
import { useColorScheme } from "react-native";

export default function useAppTheme() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkThemeVars : lightThemeVars;
  const colors = colorScheme === "dark" ? darkThemeColors : lightThemeColors;

  return [theme, colors] as [Record<string, string>, typeof darkThemeColors & typeof lightThemeColors];
}
