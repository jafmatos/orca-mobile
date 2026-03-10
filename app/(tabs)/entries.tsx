import { GlobalLayout } from "@/components/layouts/GlobalLayout";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function EntriesScreen() {
  const router = useRouter();

  return (
    <GlobalLayout>
      <Text>EntriesScreen</Text>
      <Button onPress={() => router.push("/schedules")} title="Ir para SchedulesScreen" />
    </GlobalLayout>
  );
}
