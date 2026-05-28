import { useAppTheme } from "@/hooks/use-app-theme";
import { currencyFormatter } from "@/utils/currencyFormatter";
import React from "react";
import { View } from "react-native";
import { Icon, Surface, Text } from "react-native-paper";
import { AppHideableCurrencyText } from "../ui/AppHideableCurrencyText";
import { AppHideableCurrencyToggle } from "../ui/AppHideableCurrencyToggle";

export interface BalanceCardProps {
  amount?: number;
}

export function BalanceCard(props: BalanceCardProps) {
  const theme = useAppTheme();
  const textColor = theme.colors.onSurface;
  const secondaryTextColor = theme.colors.onSurfaceVariant;

  return (
    <Surface
      style={{
        borderRadius: theme.roundness,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
        padding: 20,
        height: 110,
      }}
      className="w-full flex flex-col justify-between"
    >
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-2">
          <Icon source="wallet-outline" size={16} color={theme.colors.primary} />
          <Text variant="titleSmall" style={{ color: secondaryTextColor, fontWeight: "500" }}>
            Saldo disponível
          </Text>
        </View>

        <AppHideableCurrencyToggle size={18} />
      </View>

      <View>
        <AppHideableCurrencyText variant="headlineMedium" style={{ fontWeight: "bold", color: textColor, letterSpacing: -0.5 }}>
          {currencyFormatter.format(props.amount || 0)}
        </AppHideableCurrencyText>
      </View>
    </Surface>
  );
}
