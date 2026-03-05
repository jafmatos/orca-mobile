import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function EntriesScreen() {
  const router = useRouter();

  return (
    <KeyboardAvoidingComponent>
      <Text>EntriesScreen</Text>
      <Button onPress={() => router.push("/schedules")} title="Ir para SchedulesScreen" />
    </KeyboardAvoidingComponent>
  );
}
