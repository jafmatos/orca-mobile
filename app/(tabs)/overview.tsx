import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { ExpenseByCategoryChart, ExpenseByCategoryChartRef } from "@/components/overview/charts/ExpenseByCategoryChart";
import { LimitsMonitorChart, LimitsMonitorChartRef } from "@/components/overview/charts/LimitsMonitorChart";
import { MonthlyEvolutionChart } from "@/components/overview/charts/MonthlyEvolutionChart";
import { ExpenseCard } from "@/components/overview/ExpenseCard";
import { IncomeCard } from "@/components/overview/IncomeCard";
import { AppSkeleton } from "@/components/ui/AppSkeleton";
import { AppTabHeader } from "@/components/ui/AppTabHeader";
import { useKpis } from "@/hooks/queries/use-kpis";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

type PeriodDateFilter = {
  ge?: Date;
  le?: Date;
};

export default function OverviewScreen() {
  const [periodFilter, setDatePeriodFilter] = useState<PeriodDateFilter | undefined>(undefined);
  const kpisQuery = useKpis({ filter: { when: periodFilter } });

  const expenseByCategoryChartRef = React.useRef<ExpenseByCategoryChartRef>(null);
  const limitsMonitorChartRef = React.useRef<LimitsMonitorChartRef>(null);

  useEffect(() => {
    expenseByCategoryChartRef.current?.query.refetch();
    limitsMonitorChartRef.current?.query.refetch();
  }, [periodFilter]);

  const handlePeriodDateFilterPrevious = useCallback(() => {
    if (!periodFilter) {
      const ge = new Date();
      const le = new Date();

      ge.setDate(1);
      ge.setHours(0, 0, 0, 0);

      // Using new Date to force react to rerender the label by changing the date object references
      setDatePeriodFilter({
        ge: new Date(ge),
        le: new Date(le),
      });

      return;
    }

    const ge = periodFilter.ge! || new Date();
    const le = periodFilter.le! || new Date();

    ge.setMonth(ge.getMonth() - 1);
    ge.setDate(1);
    ge.setHours(0, 0, 0, 0);
    le.setDate(1);
    le.setHours(0, 0, 0, 0);
    le.setMilliseconds(-1);

    // Using new Date to force react to rerender the label by changing the date object references
    setDatePeriodFilter({
      ge: new Date(ge),
      le: new Date(le),
    });
  }, [periodFilter]);

  const handlePeriodDateFilterNext = useCallback(() => {
    const ge = periodFilter?.ge || new Date();
    const le = periodFilter?.le || new Date();
    const nextMonth = new Date(ge);

    nextMonth.setMonth(ge.getMonth() + 1);
    nextMonth.setDate(ge.getDate());
    nextMonth.setHours(0, 0, 0, 0);

    if (nextMonth.getTime() > Date.now()) {
      setDatePeriodFilter(undefined);

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

    setDatePeriodFilter({
      ge: new Date(ge),
      le: new Date(le),
    });
  }, [periodFilter?.ge, periodFilter?.le]);

  const periodDateLabel = useMemo(() => {
    const dateLabel = periodFilter?.ge?.toLocaleString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    const capitalizedDateLabel = dateLabel?.replace(/./, dateLabel[0].toUpperCase());

    return periodFilter?.ge ? capitalizedDateLabel : "Período atual";
  }, [periodFilter?.ge]);

  return (
    <TabbedLayout>
      <AppTabHeader>
        <IconButton icon="arrow-left" onPress={handlePeriodDateFilterPrevious} />

        <Text variant="titleLarge" numberOfLines={1}>
          {periodDateLabel}
        </Text>

        <IconButton icon="arrow-right" onPress={handlePeriodDateFilterNext} disabled={!periodFilter?.ge && !periodFilter?.le} />
      </AppTabHeader>

      <ScrollView style={{ flex: 1 }} contentContainerClassName="p-4 flex gap-4">
        <View className="flex flex-col gap-4">
          <View className="flex flex-row gap-4">
            {kpisQuery.isPending || kpisQuery.isFetching ? (
              <AppSkeleton height={90} />
            ) : (
              <ExpenseCard amount={kpisQuery.data?.status.totalExpense} />
            )}
            {kpisQuery.isPending || kpisQuery.isFetching ? (
              <AppSkeleton height={90} />
            ) : (
              <IncomeCard amount={kpisQuery.data?.status.totalIncome} />
            )}
          </View>
        </View>

        <LimitsMonitorChart ref={limitsMonitorChartRef} filter={periodFilter ? { when: periodFilter } : undefined} />
        <ExpenseByCategoryChart ref={expenseByCategoryChartRef} filter={periodFilter ? { when: periodFilter } : undefined} />
        <MonthlyEvolutionChart />
      </ScrollView>
    </TabbedLayout>
  );
}
