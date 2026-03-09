import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { ThemedComponent } from "@/components/ThemedComponent";
import { AppThemeNameStore } from "@/utils/AppThemeNameStore";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedComponent>
      <KeyboardAvoidingComponent>
        <Text>HomeScreen</Text>
        <Button onPress={() => router.push("/sign-in")} title="Ir para SignInScreen" />
      </KeyboardAvoidingComponent>
    </ThemedComponent>
  );
}
