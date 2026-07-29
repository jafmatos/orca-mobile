import { useColorScheme } from "react-native";
import { useThemePreference } from "./use-theme-preference";

export type AppThemeName = "dark" | "light";

export const useAppThemeName = (): AppThemeName => {
  const systemTheme = useColorScheme() || "light";
  const preference = useThemePreference((state) => state.preference);

  if (preference === "system") return systemTheme;
  return preference;
};
