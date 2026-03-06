import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { ThemedComponent } from "@/components/ThemedComponent";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function SchedulesScreen() {
  const router = useRouter();

  return (
    <ThemedComponent>
      <KeyboardAvoidingComponent>
        <Text>SchedulesScreen</Text>
        <Button onPress={() => router.push("/(tabs)/entries")} title="Ir para EntriesScreen" />
      </KeyboardAvoidingComponent>
    </ThemedComponent>
  );
}
