import { AppToast } from "../AppToast";
import { KeyboardAvoidingComponent } from "../KeyboardAvoindingComponent";
import { PropsWithChildren } from "react";
import { SafeAreaComponent } from "../SafeAreaComponent";
import { useTheme } from "react-native-paper";

export function FullScreenLayout(props: PropsWithChildren) {
  const theme = useTheme();

  return (
    <KeyboardAvoidingComponent style={{ backgroundColor: theme.colors.background }}>
      <SafeAreaComponent style={{ flex: 1 }}>
        {props.children}
        <AppToast topOffset={80} />
      </SafeAreaComponent>
    </KeyboardAvoidingComponent>
  );
}
