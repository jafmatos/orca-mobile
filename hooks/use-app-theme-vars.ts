import { darkThemeVars } from "@/themes/tailwind-dark-theme-vars";
import { lightThemeVars } from "@/themes/tailwind-light-theme-vars";
import { useAppThemeName } from "./use-app-theme-name";

export default function useAppThemeVars() {
	const themeName = useAppThemeName();
  const vars = themeName === "dark" ? darkThemeVars : lightThemeVars;

  return vars;
}
