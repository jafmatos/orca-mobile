import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { ThemedComponent } from "@/components/ThemedComponent";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function EntriesScreen() {
  const router = useRouter();

  return (
    <ThemedComponent>
      <KeyboardAvoidingComponent>
        <Text>EntriesScreen</Text>
        <Button onPress={() => router.push("/schedules")} title="Ir para SchedulesScreen" />
      </KeyboardAvoidingComponent>
    </ThemedComponent>
  );
}
