import { AppSkeleton } from "@/components/ui/AppSkeleton";
import { Conditional } from "@/components/utils/Conditional";
import { useOverviewExpenseByCategory, UseOverviewExpenseByCategoryOptions } from "@/hooks/queries/use-overview-expense-by-category";
import { useAppTheme } from "@/hooks/use-app-theme";
import { currencyFormatter } from "@/utils/currencyFormatter";
import React, { useImperativeHandle, useMemo } from "react";
import { View, FlatList } from "react-native";
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import { Text } from "react-native-paper";
import { AppChartContainer } from "@/components/ui/AppChartContainer";
import { UseQueryResult } from "@tanstack/react-query";
import { GetExpenseByCategoryReturnType } from "@/services/OverviewService";
import { AppHideableCurrencyText } from "@/components/ui/AppHideableCurrencyText";

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

    return (
      <AppChartContainer>
        <AppChartContainer.Content>
          <AppChartContainer.Title>Despesa por Categoria</AppChartContainer.Title>

          <PieChart
            radius={120}
            innerRadius={80}
            donut
            edgesRadius={theme.roundness}
            innerCircleColor={theme.colors.surface}
            data={
              expenseByCategoryQuery.data?.status.totalExpense && !expenseByCategoryQuery.isPending && !expenseByCategoryQuery.isFetching
                ? expenseByCategoryChartData
                : [{ value: 0, color: theme.colors.surfaceDisabled }]
            }
            centerLabelComponent={() => {
              return (
                <View>
                  <AppHideableCurrencyText variant="labelLarge">{expenseByCategoryCenterLabel}</AppHideableCurrencyText>
                </View>
              );
            }}
          />

          <View className="w-full flex gap-2">
            <Conditional
              if={!!expenseByCategoryQuery.data && !expenseByCategoryQuery.isPending && !expenseByCategoryQuery.isFetching}
              _then={
                <View className="w-full flex gap-2">
                  {expenseByCategoryQuery.data?.categories.map((category, index) => {
                    return (
                      <View
                        key={index}
                        className="w-full flex flex-row items-center gap-2"
                        style={{
                          height: 24,
                        }}
                      >
                        <View
                          style={{
                            width: 16,
                            aspectRatio: "1/1",
                            borderRadius: "50%",
                            backgroundColor: theme.colors.chart[index % theme.colors.chart.length],
                          }}
                        />
                        <Text className="grow" variant="bodyMedium">
                          {category.name}
                        </Text>

                        <AppHideableCurrencyText variant="bodyMedium">{currencyFormatter.format(category.spent)}</AppHideableCurrencyText>
                      </View>
                    );
                  })}
                </View>
              }
              _else={
                <FlatList
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                  data={Array.from({ length: 10 })}
                  renderItem={() => {
                    return <AppSkeleton height={24} />;
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
