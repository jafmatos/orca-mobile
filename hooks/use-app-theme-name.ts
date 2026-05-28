import { useColorScheme } from "react-native";

export type AppThemeName = "dark" | "light";

export const useAppThemeName = (): AppThemeName => {
  return useColorScheme()!;
};
