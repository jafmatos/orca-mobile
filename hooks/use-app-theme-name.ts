// import { AppThemeNameStore } from "@/utils/AppThemeNameStore";
import { useColorScheme } from "react-native";

export type AppThemeName = "dark" | "light";

export const useAppThemeName = (): AppThemeName => {
  // const colorScheme = useColorScheme() || "light";
  // const appThemeName = AppThemeNameStore.get();

  // if (!appThemeName || appThemeName === "system") return colorScheme;

  // return appThemeName;

  return useColorScheme()!;
};
