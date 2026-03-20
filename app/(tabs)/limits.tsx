import { View } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function LimitsScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>LimitsScreen</Text>
      <Button onPress={() => router.push("/(tabs)/categories")} title="Ir para CategoriesScreen" />
    </View>
  );
}
