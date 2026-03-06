import { darkTheme, darkThemeColors } from "@/themes/dark-theme";
import { lightTheme, lightThemeColors } from "@/themes/light-theme";
import { useColorScheme } from "react-native";

export default function useAppTheme() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const colors = colorScheme === "dark" ? darkThemeColors : lightThemeColors;

  return [theme, colors] as [Record<string, string>, typeof darkThemeColors & typeof lightThemeColors];
}
