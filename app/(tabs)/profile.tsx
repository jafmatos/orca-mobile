import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { ThemedComponent } from "@/components/ThemedComponent";
import { Text } from "react-native";

export default function ProfileScreen() {
  return (
    <ThemedComponent>
      <KeyboardAvoidingComponent>
        <Text>ProfileScreen</Text>
      </KeyboardAvoidingComponent>
    </ThemedComponent>
  );
}
