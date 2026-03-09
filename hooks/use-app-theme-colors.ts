import { darkThemeColors } from "@/themes/tailwind-dark-theme-vars";
import { lightThemeColors } from "@/themes/tailwind-light-theme-vars";
import { useAppThemeName } from "./use-app-theme-name";

export default function useAppThemeColors() {
  const themeName = useAppThemeName();
  const colors = themeName === "dark" ? darkThemeColors : lightThemeColors;

  return colors;
}
