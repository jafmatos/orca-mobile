import { gluestackDarkThemeColorTokens } from "@/themes/gluestack-dark-theme-color-tokens";
import { gluestackLightThemeColorTokens } from "@/themes/gluestack-light-theme-color-tokens";
import { useAppThemeName } from "./use-app-theme-name";

export const useAppGluestackColorTokens = () => {
  const themeName = useAppThemeName();

  return themeName === "dark" ? gluestackDarkThemeColorTokens : gluestackLightThemeColorTokens;
};
