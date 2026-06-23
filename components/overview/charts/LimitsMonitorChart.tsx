import { AppChartContainer } from "@/components/ui/AppChartContainer";
import { AppHideableCurrencyText } from "@/components/ui/AppHideableCurrencyText";
import { AppHideableCurrencyToggle } from "@/components/ui/AppHideableCurrencyToggle";
import { AppSkeleton } from "@/components/ui/AppSkeleton";
import { Conditional } from "@/components/utils/Conditional";
import { useOverviewExpenseByCategory, UseOverviewExpenseByCategoryOptions } from "@/hooks/queries/use-overview-expense-by-category";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Category } from "@/models/Category";
import { GetExpenseByCategoryReturnType } from "@/services/Api/OverviewApiService";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { UseQueryResult } from "@tanstack/react-query";
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ProgressBar, Text } from "react-native-paper";

import { AppErrorState } from "@/components/ui/AppErrorState";

export interface LimitsMonitorChartRef {
  query: UseQueryResult<GetExpenseByCategoryReturnType, Error>;
}

export interface LimitsMonitorChartProps {
  filter?: UseOverviewExpenseByCategoryOptions["filter"];
}

export const LimitsMonitorChart = React.forwardRef<LimitsMonitorChartRef, LimitsMonitorChartProps>(function LimitsMonitorChart(
  props: LimitsMonitorChartProps,
  ref,
) {
  const theme = useAppTheme();
  const expenseByCategoryQuery = useOverviewExpenseByCategory({ filter: props.filter });

  const [lastCount, setLastCount] = useState<number>(10);

  const categoriesWithLimit = useMemo(() => {
    return (
      expenseByCategoryQuery.data?.categories
        .filter((category) => !!category.limit)
        .sort((categoryA, categoryB) => categoryB.spent / categoryB.limit!.amount - categoryA.spent / categoryA.limit!.amount) || []
    );
  }, [expenseByCategoryQuery.data?.categories]);

  useEffect(() => {
    const newCount = categoriesWithLimit.length;

    if (newCount > 0) {
      setLastCount((prev) => (prev !== newCount ? newCount : prev));
    }
  }, [categoriesWithLimit.length]);

  const getProgressBarColorByPercentage = useCallback(
    (percentage: number) => {
      if (percentage < 70) return theme.colors.success;
      if (percentage < 90) return theme.colors.warning;

      return theme.colors.error;
    },
    [theme.colors.error, theme.colors.success, theme.colors.warning],
  );

  const renderListItem = useCallback(
    ({ item }: { item: Category }) => {
      const percentageSpent = Math.round((100 * item.spent) / item.limit!.amount);
      const isOverLimit = item.spent > item.limit!.amount;

      return (
        <View className="w-full flex flex-col gap-2 py-2">
          <View className="flex flex-col gap-1">
            <View className="flex flex-row items-center justify-between">
              <Text variant="titleSmall" style={{ color: theme.colors.onSurface, flexShrink: 1 }} numberOfLines={1}>
                {item.name}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: getProgressBarColorByPercentage(percentageSpent), fontWeight: "600", marginLeft: 8 }}
              >
                {percentageSpent}%
              </Text>
            </View>

            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-baseline gap-1 flex-1 flex-wrap">
                <AppHideableCurrencyText variant="bodySmall" style={{ color: isOverLimit ? theme.colors.error : theme.colors.onSurface }}>
                  {currencyFormatter.format(item.spent)} de {currencyFormatter.format(item.limit!.amount)}
                </AppHideableCurrencyText>
              </View>

              {isOverLimit && (
                <View
                  style={{
                    backgroundColor: theme.colors.errorContainer,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                    marginLeft: 8,
                  }}
                >
                  <Text style={{ color: theme.colors.onErrorContainer, fontSize: 9, fontWeight: "bold" }}>EXCEDIDO</Text>
                </View>
              )}
            </View>
          </View>
          <ProgressBar
            progress={Math.min(1, item.spent / item.limit!.amount)}
            color={getProgressBarColorByPercentage(percentageSpent)}
            style={{ borderRadius: 4, height: 6 }}
          />
        </View>
      );
    },
    [getProgressBarColorByPercentage, theme.colors],
  );

  useImperativeHandle(ref, () => {
    return {
      query: expenseByCategoryQuery,
    };
  });

  if (expenseByCategoryQuery.isError) {
    return (
      <View className="p-6">
        <AppErrorState message={expenseByCategoryQuery.error?.message} onRetry={() => expenseByCategoryQuery.refetch()} />
      </View>
    );
  }

  return (
    <AppChartContainer className="p-6">
      <AppChartContainer.Content>
        <View className="flex flex-row gap-4 items-center">
          <AppChartContainer.Title>Monitor de Limites</AppChartContainer.Title>

          <AppHideableCurrencyToggle size={18} />
        </View>

        <Conditional
          if={!expenseByCategoryQuery.isPending && !expenseByCategoryQuery.isFetching}
          _then={
            <Conditional
              if={categoriesWithLimit.length > 0}
              _then={
                <FlatList
                  className="w-full"
                  data={categoriesWithLimit}
                  renderItem={renderListItem}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => <View className="h-2" />}
                />
              }
              _else={
                <View className="w-full py-6 items-center justify-center flex flex-col gap-2">
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: "center" }}>
                    Nenhum limite de gastos definido para suas categorias.
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.outline, textAlign: "center" }}>
                    Defina limites nas suas categorias para acompanhar seus gastos aqui.
                  </Text>
                </View>
              }
            />
          }
          _else={
            <View className="w-full flex flex-col gap-2">
              {Array.from({ length: lastCount || categoriesWithLimit.length || 10 })
                .fill(false)
                .map((_, index) => {
                  return (
                    <View key={index} className="w-full flex flex-col gap-2 py-2">
                      <View className="flex flex-col gap-1">
                        <View className="flex flex-row items-center justify-between">
                          <AppSkeleton height={20} width={150} />
                          <AppSkeleton height={20} width={50} />
                        </View>

                        <View className="flex flex-row items-center justify-between">
                          <AppSkeleton height={16} width={200} />
                        </View>
                      </View>

                      <AppSkeleton height={6} />
                    </View>
                  );
                })}
            </View>
          }
        />
      </AppChartContainer.Content>
    </AppChartContainer>
  );
});
