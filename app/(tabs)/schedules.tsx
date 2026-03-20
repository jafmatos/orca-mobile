import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function SchedulesScreen() {
  const router = useRouter();

  return (
    <TabbedLayout>
      <Text>SchedulesScreen</Text>
      <Button onPress={() => router.push("/(tabs)/entries")} title="Ir para EntriesScreen" />
    </TabbedLayout>
  );
}
