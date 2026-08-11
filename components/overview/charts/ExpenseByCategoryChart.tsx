import { AppChartContainer } from "@/components/ui/AppChartContainer";
import { AppHideableCurrencyText } from "@/components/ui/AppHideableCurrencyText";
import { AppHideableCurrencyToggle } from "@/components/ui/AppHideableCurrencyToggle";
import { AppSkeleton } from "@/components/ui/AppSkeleton";
import { AppConditional } from "@/components/utils/AppConditional";
import { useOverviewExpenseByCategory, UseOverviewExpenseByCategoryOptions } from "@/hooks/queries/use-overview-expense-by-category";
import { useAppTheme } from "@/hooks/use-app-theme";
import { GetExpenseByCategoryReturnType } from "@/services/Api/OverviewApiService";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { UseQueryResult } from "@tanstack/react-query";
import React, { useEffect, useImperativeHandle, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import { Text } from "react-native-paper";

import { AppErrorState } from "@/components/ui/AppErrorState";

export interface ExpenseByCategoryChartRef {
  query: UseQueryResult<GetExpenseByCategoryReturnType, Error>;
}

export interface ExpenseByCategoryChartProps {
  filter?: UseOverviewExpenseByCategoryOptions["filter"];
}

export const ExpenseByCategoryChart = React.forwardRef<ExpenseByCategoryChartRef, ExpenseByCategoryChartProps>(
  function ExpenseByCategoryChart(props: ExpenseByCategoryChartProps, ref) {
    const theme = useAppTheme();
    const expenseByCategoryQuery = useOverviewExpenseByCategory({ filter: props.filter });

    const [lastCount, setLastCount] = useState<number | undefined>(undefined);

    useEffect(() => {
      const currentLength = expenseByCategoryQuery.data?.categories.length;
      if (currentLength && currentLength > 0) {
        setLastCount(currentLength);
      }
    }, [expenseByCategoryQuery.data?.categories]);

    const expenseByCategoryChartData = useMemo(() => {
      if (!expenseByCategoryQuery.data) return [];

      return expenseByCategoryQuery.data.categories.map((category, index): pieDataItem => {
        return {
          value: category.spent,
          color: theme.colors.chart[index % theme.colors.chart.length],
          endEdgeRadius: theme.roundness,
          startEdgeRadius: theme.roundness,
        };
      });
    }, [expenseByCategoryQuery.data, theme.colors.chart, theme.roundness]);

    const expenseByCategoryCenterLabel = useMemo(() => {
      if (expenseByCategoryQuery.isPending || expenseByCategoryQuery.isFetching) {
        return currencyFormatter.format(0);
      }

      return currencyFormatter.format(expenseByCategoryQuery.data?.status.totalExpense || 0);
    }, [expenseByCategoryQuery]);

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
            <AppChartContainer.Title>Despesa por Categoria</AppChartContainer.Title>

            <AppHideableCurrencyToggle size={18} />
          </View>

          <PieChart
            radius={120}
            innerRadius={80}
            donut
            edgesRadius={theme.roundness}
            innerCircleColor={theme.colors.surface}
            data={
              expenseByCategoryQuery.data?.status.totalExpense && !expenseByCategoryQuery.isPending && !expenseByCategoryQuery.isFetching
                ? expenseByCategoryChartData
                : [{ value: 1, color: theme.colors.surfaceDisabled }]
            }
            centerLabelComponent={() => {
              return (
                <View className="items-center justify-center">
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Total
                  </Text>
                  <AppHideableCurrencyText variant="titleMedium" style={{ fontWeight: "bold", marginTop: 2 }}>
                    {expenseByCategoryCenterLabel}
                  </AppHideableCurrencyText>
                </View>
              );
            }}
          />

          <View className="w-full flex gap-2">
            <AppConditional
              if={!!expenseByCategoryQuery.data && !expenseByCategoryQuery.isPending && !expenseByCategoryQuery.isFetching}
              _then={
                <AppConditional
                  if={(expenseByCategoryQuery.data?.categories?.length || 0) > 0}
                  _then={
                    <View className="w-full flex flex-col">
                      {(expenseByCategoryQuery.data?.categories || []).map((category, index) => {
                        const totalExpense = expenseByCategoryQuery.data?.status.totalExpense || 1;
                        const percentage = Math.round((category.spent / totalExpense) * 100);

                        return (
                          <View key={index} className="w-full flex flex-row items-center gap-3 py-2">
                            <View
                              style={{
                                width: 14,
                                aspectRatio: "1/1",
                                borderRadius: "50%",
                                backgroundColor: theme.colors.chart[index % theme.colors.chart.length],
                              }}
                            />
                            <View className="flex flex-row items-center grow gap-2 pr-2">
                              <Text variant="bodyMedium" numberOfLines={1} style={{ flexShrink: 1 }}>
                                {category.name}
                              </Text>
                              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                {percentage}%
                              </Text>
                            </View>

                            <AppHideableCurrencyText variant="bodyMedium">
                              {currencyFormatter.format(category.spent)}
                            </AppHideableCurrencyText>
                          </View>
                        );
                      })}
                    </View>
                  }
                  _else={
                    <View className="w-full py-6 items-center justify-center flex flex-col gap-2">
                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: "center" }}>
                        Nenhuma despesa registrada.
                      </Text>
                    </View>
                  }
                />
              }
              _else={
                <FlatList
                  scrollEnabled={false}
                  data={Array.from({ length: lastCount || 5 })}
                  renderItem={() => {
                    return (
                      <View className="w-full flex flex-row items-center gap-3 py-2">
                        <AppSkeleton width={14} height={14} />

                        <View className="flex flex-row items-center grow gap-2 pr-2">
                          <AppSkeleton height={20} width={120} />
                          <AppSkeleton height={20} width={40} />
                        </View>

                        <AppSkeleton height={20} width={80} />
                      </View>
                    );
                  }}
                />
              }
            />
          </View>
        </AppChartContainer.Content>
      </AppChartContainer>
    );
  },
);
