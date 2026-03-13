import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function SchedulesScreen() {
  const router = useRouter();

  return (
    <TabbedLayout>
      <Navigation />
      <Text>SchedulesScreen</Text>
      <Button onPress={() => router.push("/(tabs)/entries")} title="Ir para EntriesScreen" />
    </TabbedLayout>
  );
}
