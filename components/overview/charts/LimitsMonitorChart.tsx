import { useOverviewExpenseByCategory, UseOverviewExpenseByCategoryOptions } from "@/hooks/queries/use-overview-expense-by-category";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Category } from "@/models/Category";
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ProgressBar, Text } from "react-native-paper";
import { AppChartContainer } from "@/components/ui/AppChartContainer";
import { AppSkeleton } from "@/components/ui/AppSkeleton";
import { Conditional } from "@/components/utils/Conditional";
import { UseQueryResult } from "@tanstack/react-query";
import { GetExpenseByCategoryReturnType } from "@/services/OverviewService";

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

      return (
        <View className="w-full flex flex-col gap-2" style={{ height: 32 }}>
          <View className="flex flex-row items-center justify-between">
            <Text>{item.name}</Text>
            <Text>{percentageSpent}%</Text>
          </View>
          <ProgressBar progress={item.spent / item.limit!.amount} color={getProgressBarColorByPercentage(percentageSpent)} />
        </View>
      );
    },
    [getProgressBarColorByPercentage],
  );

  useImperativeHandle(ref, () => {
    return {
      query: expenseByCategoryQuery,
    };
  });

  return (
    <AppChartContainer>
      <AppChartContainer.Content>
        <AppChartContainer.Title>Monitor de Limites</AppChartContainer.Title>

        <Conditional
          if={!expenseByCategoryQuery.isPending && !expenseByCategoryQuery.isFetching}
          _then={
            <FlatList
              className="w-full"
              data={categoriesWithLimit}
              renderItem={renderListItem}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View className="h-4" />}
            />
          }
          _else={
            <View className="w-full flex gap-4">
              {Array.from({ length: lastCount || categoriesWithLimit.length || 10 })
                .fill(false)
                .map((_, index) => {
                  return <AppSkeleton key={index} height={32} />;
                })}
            </View>
          }
        />
      </AppChartContainer.Content>
    </AppChartContainer>
  );
});
