import { GlobalLayout } from "@/components/layouts/GlobalLayout";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function LimitsScreen() {
  const router = useRouter();

  return (
    <GlobalLayout>
      <Text>LimitsScreen</Text>
      <Button onPress={() => router.push("/(tabs)/categories")} title="Ir para CategoriesScreen" />
    </GlobalLayout>
  );
}
