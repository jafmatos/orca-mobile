import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function SchedulesScreen() {
  const router = useRouter();

  return (
    <KeyboardAvoidingComponent>
      <Text>SchedulesScreen</Text>
      <Button onPress={() => router.push("/(tabs)/entries")} title="Ir para EntriesScreen" />
    </KeyboardAvoidingComponent>
  );
}
