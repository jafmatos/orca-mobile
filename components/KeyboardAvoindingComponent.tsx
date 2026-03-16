import { PropsWithChildren } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

export function KeyboardAvoidingComponent(props: PropsWithChildren) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      {props.children}
    </KeyboardAvoidingView>
  );
}
