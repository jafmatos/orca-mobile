import { useAppTheme } from "@/hooks/use-app-theme";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { View } from "react-native";
import { Surface, Icon, Text } from "react-native-paper";

export interface BalanceCardProps {
  amount?: number;
}

export function BalanceCard(props: BalanceCardProps) {
  const theme = useAppTheme();

  return (
    <Surface
      className="grow flex-1 flex flex-row items-center"
      elevation={1}
      style={{
        // height: 90,
        flexShrink: 0,
        borderRadius: theme.roundness,
      }}
    >
      <View className="p-4 flex flex-col gap-2">
        <View className="flex flex-row items-center gap-2">
          <Text variant="titleMedium">Saldo</Text>
        </View>

        <Text variant="headlineMedium">{currencyFormatter.format(props.amount || 0)}</Text>
      </View>
    </Surface>
  );
}
