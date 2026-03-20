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
    <>
      <ThemedComponent.Background />
      {props.children}
    </>
  );
}
