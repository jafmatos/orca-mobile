import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function EntriesScreen() {
  const router = useRouter();

  return (
    <TabbedLayout>
      <Navigation />
      <Text>EntriesScreen</Text>
      <Button onPress={() => router.push("/schedules")} title="Ir para SchedulesScreen" />
    </TabbedLayout>
  );
}
