import { useAppTheme } from "@/hooks/use-app-theme";
import { currencyFormatter } from "@/utils/currencyFormatter";
import React from "react";
import { View } from "react-native";
import { Icon, Surface, Text } from "react-native-paper";
import { AppHideableCurrencyText } from "../ui/AppHideableCurrencyText";
import { AppHideableCurrencyToggle } from "../ui/AppHideableCurrencyToggle";
import { AppSkeleton } from "../ui/AppSkeleton";

export interface BalanceCardProps {
  amount?: number;
  loading?: boolean;
}

export function BalanceCard(props: BalanceCardProps) {
  const theme = useAppTheme();

  return (
    <Surface
      style={{
        borderRadius: theme.roundness,
        backgroundColor: theme.colors.primary,
        padding: 20,
        height: 120,
      }}
      elevation={2}
      className="w-full flex flex-col justify-between"
    >
      <View className="flex flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-2">
          <Icon source="wallet-outline" size={18} color={theme.colors.onPrimary} />
          <Text variant="titleSmall" style={{ color: theme.colors.onPrimary, opacity: 0.9, fontWeight: "500" }}>
            Saldo disponível
          </Text>
        </View>

        <AppHideableCurrencyToggle size={20} color={theme.colors.onPrimary} />
      </View>

      <View>
        {props.loading ? (
          <AppSkeleton height={36} width={150} color={theme.colors.onPrimaryContainer} />
        ) : (
          <AppHideableCurrencyText
            variant="headlineMedium"
            style={{ fontWeight: "bold", color: theme.colors.onPrimary, letterSpacing: -0.5 }}
          >
            {currencyFormatter.format(props.amount || 0)}
          </AppHideableCurrencyText>
        )}
      </View>
    </Surface>
  );
}
