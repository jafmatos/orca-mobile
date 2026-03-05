import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function SignInScreen() {
  const router = useRouter();

  return (
    <KeyboardAvoidingComponent>
      <Text>SignInScreen</Text>
      <Button onPress={() => router.push("/(tabs)")} title="Ir para HomeScreen" />
    </KeyboardAvoidingComponent>
  );
}
