import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <KeyboardAvoidingComponent>
      <Text>CategoriesScreen</Text>
      <Button onPress={() => router.push("/limits")} title="Ir para LimitsScreen" />
    </KeyboardAvoidingComponent>
  );
}
