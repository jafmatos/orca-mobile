import { SafeAreaView } from "react-native-safe-area-context";
import { AppToast } from "../AppToast";
import { KeyboardAvoidingComponent } from "../KeyboardAvoindingComponent";
import { ThemedComponent } from "../ThemedComponent";
import { PropsWithChildren } from "react";

export function FullScreenLayout(props: PropsWithChildren) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedComponent className="grow">
        <ThemedComponent.Background />

        <KeyboardAvoidingComponent>{props.children}</KeyboardAvoidingComponent>
        <AppToast />
      </ThemedComponent>
    </SafeAreaView>
  );
}
