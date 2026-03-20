import { KeyboardAvoidingView, Platform } from "react-native";

export function KeyboardAvoidingComponent(props: React.ComponentProps<typeof KeyboardAvoidingView>) {
  return (
    <KeyboardAvoidingView {...props} behavior={Platform.OS === "ios" ? "padding" : "height"} className={`grow ${props.className}`}>
      {props.children}
    </KeyboardAvoidingView>
  );
}
