import { PropsWithChildren } from "react";
import { AppToast } from "../AppToast";
import { KeyboardAvoidingComponent } from "../KeyboardAvoindingComponent";
import { ThemedComponent } from "../ThemedComponent";
import { View } from "@gluestack-ui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Navigation } from "../Navigation";
import { PortalHost, PortalProvider } from "@gorhom/portal";

export function TabbedLayout(props: PropsWithChildren) {
  const insets = useSafeAreaInsets();

  return (
    <PortalProvider>
      <ThemedComponent className="grow">
        <ThemedComponent.Background />

        <View style={{ flex: 1, top: insets.top, paddingBottom: insets.top, backgroundColor: "transparent" }}>
          <KeyboardAvoidingComponent>
            <Navigation />

            {props.children}
          </KeyboardAvoidingComponent>
          <AppToast />
        </View>

        <PortalHost name="bottomsheet" />
        <PortalHost name="drawer" />
      </ThemedComponent>
    </PortalProvider>
  );
}
