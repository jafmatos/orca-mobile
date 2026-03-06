import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { ThemedComponent } from "@/components/ThemedComponent";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function LimitsScreen() {
  const router = useRouter();

  return (
    <ThemedComponent>
      <KeyboardAvoidingComponent>
        <Text>LimitsScreen</Text>
        <Button onPress={() => router.push("/(tabs)/categories")} title="Ir para CategoriesScreen" />
      </KeyboardAvoidingComponent>
    </ThemedComponent>
  );
}
