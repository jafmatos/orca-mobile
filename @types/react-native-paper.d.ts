import "react-native-paper";
import { AppTheme } from "@/themes/AppTheme";

declare module "react-native-paper" {
  export function useTheme(): AppTheme;
}
