import { PropsWithChildren } from "react";
import { useTheme } from "react-native-paper";
import { AppKeyboardAvoidingComponent } from "../utils/AppKeyboardAvoidingComponent";
import { AppSafeAreaComponent } from "../utils/AppSafeAreaComponent";

export function FullScreenLayout(props: PropsWithChildren) {
  const theme = useTheme();

  return (
    <AppKeyboardAvoidingComponent style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <AppSafeAreaComponent style={{ flex: 1 }} ignoreBottomOnKeyboardOpened>{props.children}</AppSafeAreaComponent>
    </AppKeyboardAvoidingComponent>
  );
}
