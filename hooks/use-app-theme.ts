import { AppPaperTheme } from "@/themes/app-paper-theme";
import { useTheme } from "react-native-paper";

export const useAppTheme = () => {
  const theme = useTheme();

  return theme as AppPaperTheme;
};
