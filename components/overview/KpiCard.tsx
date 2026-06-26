import { useAppTheme } from "@/hooks/use-app-theme";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { View } from "react-native";
import { Icon, Surface, Text } from "react-native-paper";
import { AppHideableCurrencyText } from "../ui/AppHideableCurrencyText";
import { AppSkeleton } from "../ui/AppSkeleton";

export interface KpiCardProps {
  title: string;
  amount?: number;
  icon?: string;
  iconColor?: string;
  loading?: boolean;
}

export function KpiCard(props: KpiCardProps) {
  const theme = useAppTheme();

  return (
    <View
      className="grow flex-1 flex flex-row items-center"
      style={{
        height: 90,
        flexShrink: 0,
        borderRadius: theme.roundness,
      }}
    >
      <View className="p-2 flex flex-col gap-2">
        <View className="flex flex-row items-center gap-2" style={{ height: 24 }}>
          <Text variant="titleSmall">{props.title}</Text>

          {props.icon && <Icon size={24} source={props.icon} color={props.iconColor} />}
        </View>

        {props.loading ? (
          <AppSkeleton height={24} width={100} />
        ) : (
          <AppHideableCurrencyText variant="bodyLarge">{currencyFormatter.format(props.amount || 0)}</AppHideableCurrencyText>
        )}
      </View>
    </View>
  );
}
