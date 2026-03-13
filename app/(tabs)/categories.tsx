import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <TabbedLayout>
      <Navigation />
      <Text>CategoriesScreen</Text>
      <Button onPress={() => router.push("/limits")} title="Ir para LimitsScreen" />
    </TabbedLayout>
  );
}
