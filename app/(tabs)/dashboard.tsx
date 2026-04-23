import { PieChart, pieDataItem } from "react-native-gifted-charts";
import { Conditional } from "@/components/Conditional";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { useOverviewExpenseByCategory } from "@/hooks/queries/use-overview-expense-by-category";
import { useMemo } from "react";
import { Divider, IconButton, Surface, Text } from "react-native-paper";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ScrollView, View } from "react-native";
import { currencyFormatter } from "@/utils/currencyFormatter";

export default function DashboardScreen() {
  const theme = useAppTheme();
  const expenseByCategoryQuery = useOverviewExpenseByCategory();

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
    return currencyFormatter.format(expenseByCategoryQuery.data?.status.totalExpense || 0);
  }, [expenseByCategoryQuery]);

  return (
    <TabbedLayout>
      <ScrollView contentContainerClassName="p-4">
        <Surface
          className="flex flex-col items-center"
          style={{
            borderWidth: 1,
            borderColor: theme.colors.surfaceVariant,
            borderRadius: theme.roundness,
          }}
        >
          <View
            className="p-4 w-full flex flex-row items-center justify-between"
            style={{
              borderRadius: theme.roundness,
            }}
          >
            <IconButton icon="arrow-left" />
            <Text variant="titleLarge">Período Atual</Text>
            <IconButton icon="arrow-right" />
          </View>
          <Divider className="w-full" horizontalInset style={{ backgroundColor: theme.colors.outlineVariant }} />
          <View className="p-8 w-full flex flex-col items-center gap-8">
            <Text variant="titleMedium">Despesa por categoria</Text>

            <PieChart
              innerCircleColor={theme.colors.surface}
              donut
              radius={120}
              innerRadius={80}
              edgesRadius={theme.roundness}
              data={
                expenseByCategoryQuery.data?.status.totalExpense
                  ? expenseByCategoryChartData
                  : [{ value: 0, color: theme.colors.surfaceDisabled }]
              }
              centerLabelComponent={() => {
                return (
                  <View>
                    <Text variant="labelLarge">{expenseByCategoryCenterLabel}</Text>
                  </View>
                );
              }}
            />

            <Conditional
              if={!!expenseByCategoryQuery.data}
              then={() => {
                return (
                  <View className="grow flex gap-2">
                    {expenseByCategoryQuery.data?.categories.map((category, index) => {
                      return (
                        <View key={index} className="w-full flex flex-row items-center gap-2">
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
                          <Text variant="bodyMedium">
                            {Math.round((100 * category.spent) / (expenseByCategoryQuery.data?.status.totalExpense || 1))}%
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                );
              }}
            />
          </View>
        </Surface>
      </ScrollView>
    </TabbedLayout>
  );
}
