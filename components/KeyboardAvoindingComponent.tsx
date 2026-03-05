import { PropsWithChildren } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function KeyboardAvoidingComponent(props: PropsWithChildren) {
  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>{props.children}</KeyboardAvoidingView>
    </SafeAreaView>
  );
}
