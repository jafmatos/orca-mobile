import { useOverviewExpenseByCategory } from "@/hooks/queries/use-overview-expense-by-category";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Category } from "@/models/Category";
import { useCallback, useMemo } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ProgressBar, Text } from "react-native-paper";
import { AppChartContainer } from "../ui/AppChartContainer";
import { AppSkeleton } from "../ui/AppSkeleton";
import { Conditional } from "../utils/Conditional";
import { currencyFormatter } from "@/utils/currencyFormatter";

export function LimitsMonitorChart() {
  const theme = useAppTheme();
  const expenseByCategoryData = useOverviewExpenseByCategory();

  const categoriesWithLimit = useMemo(() => {
    return (
      expenseByCategoryData.data?.categories
        .filter((category) => !!category.limit)
        .sort((categoryA, categoryB) => categoryB.spent / categoryB.limit!.amount - categoryA.spent / categoryA.limit!.amount) || []
    );
  }, [expenseByCategoryData]);

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

  return (
    <AppChartContainer>
      <AppChartContainer.Content>
        <AppChartContainer.Title>Monitor de limites</AppChartContainer.Title>

        <Conditional
          if={!expenseByCategoryData.isPending && !expenseByCategoryData.isFetching}
          _then={() => {
            return (
              <FlatList
                className="w-full"
                data={categoriesWithLimit}
                renderItem={renderListItem}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View className="h-4" />}
              />
            );
          }}
          _else={() => {
            return (
              <View className="w-full flex gap-4">
                {Array.from({ length: categoriesWithLimit.length || 10 })
                  .fill(false)
                  .map((_, index) => {
                    return <AppSkeleton key={index} height={32} />;
                  })}
              </View>
            );
          }}
        />
      </AppChartContainer.Content>
    </AppChartContainer>
  );
}
