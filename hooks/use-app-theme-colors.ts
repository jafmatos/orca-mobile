import { useAppThemeName } from "./use-app-theme-name";
import { appDarkThemeColors } from "@/themes/app-dark-theme-colors";
import { appLightThemeColors } from "@/themes/app-light-theme-colors";

export default function useAppThemeColors() {
  const themeName = useAppThemeName();
  const colors = themeName === "dark" ? appDarkThemeColors : appLightThemeColors;

  return colors;
}
