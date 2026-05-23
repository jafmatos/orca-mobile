import { useAppTheme } from "@/hooks/use-app-theme";
import { Entry, EntryTypes } from "@/models/Entry";
import { currencyFormatter } from "@/utils/currencyFormatter";
import React from "react";
import { Pressable, View } from "react-native";
import { Surface, Text } from "react-native-paper";

export interface EntryListItemProps extends React.ComponentProps<typeof Pressable> {
  data: Entry;
}

export function EntryListItem({ data, ...pressableProps }: EntryListItemProps) {
  const theme = useAppTheme();

  return (
    <Pressable {...pressableProps}>
      <Surface style={{ borderRadius: theme.roundness }}>
        <View className="rounded-xl p-4 flex gap-2">
          <View className="flex flex-row items-center justify-between">
            <Text variant="titleMedium">{data.category?.name || "Sem categoria"}</Text>
            <Text
              style={{
                color: data.type === EntryTypes.Expense ? theme.colors.error : theme.colors.success,
              }}
            >
              {currencyFormatter.format(data.amount)}
            </Text>
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
      </Surface>
    </Pressable>
  );
}
