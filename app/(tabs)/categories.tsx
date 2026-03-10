import { GlobalLayout } from "@/components/layouts/GlobalLayout";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <GlobalLayout>
      <Text>CategoriesScreen</Text>
      <Button onPress={() => router.push("/limits")} title="Ir para LimitsScreen" />
    </GlobalLayout>
  );
}
