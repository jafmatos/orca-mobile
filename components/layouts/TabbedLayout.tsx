import { PropsWithChildren } from "react";
import { AppToast } from "../AppToast";
import { KeyboardAvoidingComponent } from "../KeyboardAvoindingComponent";
import { ThemedComponent } from "../ThemedComponent";
import { View } from "@gluestack-ui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Navigation } from "../Navigation";

export function TabbedLayout(props: PropsWithChildren) {
  const insets = useSafeAreaInsets();

  return (
    <ThemedComponent>
      <View style={{ flex: 1, top: insets.top, paddingBottom: insets.top }}>
        <KeyboardAvoidingComponent>
          <Navigation />

          {props.children}
        </KeyboardAvoidingComponent>
        <AppToast />
      </View>
    </ThemedComponent>
  );
}
