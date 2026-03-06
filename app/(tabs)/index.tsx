import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { ThemedComponent } from "@/components/ThemedComponent";
import { AppText } from "@/components/ui/AppText";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedComponent>
      <KeyboardAvoidingComponent>
        <AppText as="h1" className="text-chart-blue">
          HomeScreen
        </AppText>
        <AppText as="h1" className="text-text-secondary">
          HomeScreen
        </AppText>
        <Button onPress={() => router.push("/sign-in")} mode="contained">
          Ir para SignInScreen
        </Button>
      </KeyboardAvoidingComponent>
    </ThemedComponent>
  );
}
