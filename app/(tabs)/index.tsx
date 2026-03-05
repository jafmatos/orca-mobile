import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <KeyboardAvoidingComponent>
      <Text>HomeScreen</Text>
      <Button onPress={() => router.push("/sign-in")} title="Ir para SignInScreen" />
    </KeyboardAvoidingComponent>
  );
}
