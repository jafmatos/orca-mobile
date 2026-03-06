import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { ThemedComponent } from "@/components/ThemedComponent";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <ThemedComponent>
      <KeyboardAvoidingComponent>
        <Text>CategoriesScreen</Text>
        <Button onPress={() => router.push("/limits")} title="Ir para LimitsScreen" />
      </KeyboardAvoidingComponent>
    </ThemedComponent>
  );
}
