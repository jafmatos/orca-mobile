import { KeyboardAvoidingComponent } from "../KeyboardAvoindingComponent";
import { PropsWithChildren } from "react";
import { SafeAreaComponent } from "../SafeAreaComponent";
import { useTheme } from "react-native-paper";

export function FullScreenLayout(props: PropsWithChildren) {
  const theme = useTheme();

  return (
    <KeyboardAvoidingComponent style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <SafeAreaComponent style={{ flex: 1 }}>
        {props.children}
      </SafeAreaComponent>
    </KeyboardAvoidingComponent>
  );
}
