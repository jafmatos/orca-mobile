import { useAppTheme } from "@/hooks/use-app-theme";
import { View } from "react-native";
import { Button, Icon, Surface, Text } from "react-native-paper";

export function SubscriptionPromoCard() {
  const theme = useAppTheme();

  return (
    <Surface style={{ borderRadius: theme.roundness, overflow: "hidden", backgroundColor: theme.colors.primary }} className="!p-0">
      <View className="p-5 flex flex-col gap-3">
        <View className="flex flex-row justify-between items-center">
          <View className="flex flex-row items-center gap-2">
            <Icon source="crown" size={24} color={theme.colors.onPrimary} />
            <Text variant="titleMedium" style={{ fontWeight: "bold", color: theme.colors.onPrimary }}>
              Orça Full
            </Text>
          </View>
        </View>
        <Text variant="bodyMedium" style={{ color: theme.colors.onPrimary }}>
          Desbloqueie o{" "}
          <Text variant="bodyMedium" style={{ fontWeight: "bold", color: theme.colors.onPrimary }}>
            Antônio
          </Text>{" "}
          (IA) para obter análises financeiras personalizadas e registro inteligente de transações!
        </Text>
        <Button
          mode="contained"
          buttonColor={theme.colors.onPrimary}
          textColor={theme.colors.primary}
          className="mt-2"
          style={{ borderRadius: theme.roundness }}
          onPress={() => console.log("Upgrade requested")}
        >
          Conhecer as Vantagens
        </Button>
      </View>
    </Surface>
  );
}
