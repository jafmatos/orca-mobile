import { AppSkeleton } from "@/components/ui/AppSkeleton";
import { Conditional } from "@/components/utils/Conditional";
import { useOverviewExpenseByCategory } from "@/hooks/queries/use-overview-expense-by-category";
import { useAppTheme } from "@/hooks/use-app-theme";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { View, FlatList } from "react-native";
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import { IconButton, Text } from "react-native-paper";
import { AppChartContainer } from "../ui/AppChartContainer";

type PeriodDateFilter = {
  ge?: Date;
  le?: Date;
};

export default function ExpenseByCategoryChart() {
  const [expenseByCategoryDateFilter, setExpenseByCategoryDateFilter] = useState<PeriodDateFilter | undefined>(undefined);

  const queryClient = useQueryClient();
  const theme = useAppTheme();
  const expenseByCategoryQuery = useOverviewExpenseByCategory({
    filter: {
      when: expenseByCategoryDateFilter,
    },
  });

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
  const expenseByCategoryPeriodLabel = useMemo(() => {
    const dateLabel = expenseByCategoryDateFilter?.ge!.toLocaleString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    const capitalizedDateLabel = dateLabel?.replace(/./, dateLabel[0].toUpperCase());

    return expenseByCategoryDateFilter?.ge ? capitalizedDateLabel : "Período atual";
  }, [expenseByCategoryDateFilter?.ge]);

  const loadExpenseByCategoryChartWithPeriod = useCallback(
    (period?: PeriodDateFilter) => {
      setExpenseByCategoryDateFilter(period);

      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.Overview.getExpenseByCategory(),
          exact: true,
        });
      }, 0);
    },
    [queryClient],
  );

  const handleExpenseByCategoryChartPrevious = useCallback(() => {
    if (!expenseByCategoryDateFilter) {
      const ge = new Date();
      const le = new Date();

      ge.setDate(1);
      ge.setHours(0, 0, 0, 0);

      loadExpenseByCategoryChartWithPeriod({
        ge,
        le,
      });

      return;
    }

    const ge = expenseByCategoryDateFilter.ge! || new Date();
    const le = expenseByCategoryDateFilter.le! || new Date();

    ge.setMonth(ge.getMonth() - 1);
    ge.setDate(1);
    ge.setHours(0, 0, 0, 0);
    le.setDate(1);
    le.setHours(0, 0, 0, 0);
    le.setMilliseconds(-1);

    // Using new Date to force react to rerender the label by changing the date object references
    loadExpenseByCategoryChartWithPeriod({
      ge: new Date(ge),
      le: new Date(le),
    });
  }, [expenseByCategoryDateFilter, loadExpenseByCategoryChartWithPeriod]);

  const handleExpenseByCategoryChartNext = useCallback(() => {
    const ge = expenseByCategoryDateFilter?.ge || new Date();
    const le = expenseByCategoryDateFilter?.le || new Date();
    const nextMonth = new Date(ge);

    nextMonth.setMonth(ge.getMonth() + 1);
    nextMonth.setDate(ge.getDate());
    nextMonth.setHours(0, 0, 0, 0);

    if (nextMonth.getTime() > Date.now()) {
      loadExpenseByCategoryChartWithPeriod(undefined);

      return;
    }

    ge.setDate(1);
    ge.setHours(0, 0, 0, 0);
    ge.setMonth(ge.getMonth() + 1);

    le.setMilliseconds(1000);
    le.setMonth(le.getMonth() + 1);
    le.setDate(1);
    le.setHours(0, 0, 0, 0);
    le.setMilliseconds(-1);

    loadExpenseByCategoryChartWithPeriod({
      ge: new Date(ge),
      le: new Date(le),
    });
  }, [expenseByCategoryDateFilter?.ge, expenseByCategoryDateFilter?.le, loadExpenseByCategoryChartWithPeriod]);

  return (
    <AppChartContainer
      HeaderComponent={
        <AppChartContainer.Header>
          <IconButton icon="arrow-left" onPress={handleExpenseByCategoryChartPrevious} />
          <Text variant="titleLarge" numberOfLines={1}>
            {expenseByCategoryPeriodLabel}
          </Text>
          <IconButton icon="arrow-right" onPress={handleExpenseByCategoryChartNext} disabled={!expenseByCategoryDateFilter} />
        </AppChartContainer.Header>
      }
    >
      <AppChartContainer.Content>
        <AppChartContainer.Title>Despesa por categoria</AppChartContainer.Title>

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
                <Text variant="labelLarge">{expenseByCategoryCenterLabel}</Text>
              </View>
            );
          }}
        />

        <View className="w-full flex gap-2">
          <Conditional
            if={!!expenseByCategoryQuery.data && !expenseByCategoryQuery.isPending && !expenseByCategoryQuery.isFetching}
            _then={() => {
              return (
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

                        <Text variant="bodyMedium">{currencyFormatter.format(category.spent)}</Text>
                      </View>
                    );
                  })}
                </View>
              );
            }}
            _else={() => {
              return (
                <FlatList
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                  data={Array.from({ length: 10 })}
                  renderItem={() => {
                    return <AppSkeleton height={24} />;
                  }}
                />
              );
            }}
          />
        </View>
      </AppChartContainer.Content>
    </AppChartContainer>
  );
}
