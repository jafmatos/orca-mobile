import { useAppTheme } from "@/hooks/use-app-theme";
import { Entry, EntryTypes } from "@/models/Entry";
import { currencyFormatter } from "@/utils/currencyFormatter";
import React from "react";
import { Pressable, View } from "react-native";
import { Text, Icon } from "react-native-paper";
import { AppHideableCurrencyText } from "../ui/AppHideableCurrencyText";

export interface EntryListItemProps extends React.ComponentProps<typeof Pressable> {
  data: Entry;
  hasError?: boolean;
}

export function EntryListItem({ data, hasError, ...pressableProps }: EntryListItemProps) {
  const theme = useAppTheme();

  return (
    <Pressable {...pressableProps}>
      <View style={{ borderRadius: theme.roundness, borderWidth: hasError ? 1 : 0, borderColor: theme.colors.error }}>
        <View className="rounded-xl p-2 flex gap-2">
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-2">
              {hasError && <Icon source="alert-circle" color={theme.colors.error} size={18} />}
              <Text variant="titleMedium">{data.category?.name || "Sem categoria"}</Text>
            </View>
            <AppHideableCurrencyText
              style={{
                color: data.type === EntryTypes.Expense ? theme.colors.error : theme.colors.success,
              }}
            >
              {currencyFormatter.format(data.amount)}
            </AppHideableCurrencyText>
          </View>
          <View className="flex flex-row items-center justify-between gap-4">
            <View style={{ flexShrink: 1 }}>
              <Text variant="bodyMedium" ellipsizeMode="tail" numberOfLines={1}>
                {data.description || "Sem descrição"}
              </Text>
            </View>
            <Text variant="bodySmall">
              {new Date(data.when).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "short",
              })}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
