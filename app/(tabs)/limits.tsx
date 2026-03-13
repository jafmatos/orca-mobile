import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function LimitsScreen() {
  const router = useRouter();

  return (
    <TabbedLayout>
      <Navigation />
      <Text>LimitsScreen</Text>
      <Button onPress={() => router.push("/(tabs)/categories")} title="Ir para CategoriesScreen" />
    </TabbedLayout>
  );
}
