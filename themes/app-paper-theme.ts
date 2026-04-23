import { MD3Theme } from "react-native-paper";

export interface AppPaperTheme extends MD3Theme {
  colors: MD3Theme["colors"] & {
    success: string;
    onSuccess: string;
    successContainer: string;
    onSuccessContainer: string;
    info: string;
    onInfo: string;
    infoContainer: string;
    onInfoContainer: string;
    warning: string;
    onWarning: string;
    warningContainer: string;
    onWarningContainer: string;
    chart: string[];
  };
}
