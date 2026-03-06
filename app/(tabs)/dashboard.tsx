import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { ThemedComponent } from "@/components/ThemedComponent";
import { Text } from "react-native";

export default function DashboardScreen() {
  return (
    <ThemedComponent>
      <KeyboardAvoidingComponent>
        <Text>DashboardScreen</Text>
      </KeyboardAvoidingComponent>
    </ThemedComponent>
  );
}
