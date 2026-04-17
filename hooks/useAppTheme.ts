import { AppPaperTheme } from "@/themes/AppPaperTheme";
import { useTheme } from "react-native-paper";

export const useAppTheme = () => {
  const theme = useTheme();

  return theme as AppPaperTheme;
};
