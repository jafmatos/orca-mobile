import { useMonthlyEvolution } from "@/hooks/queries/use-monthly-evolution";
import { useAppTheme } from "@/hooks/use-app-theme";
import { createRef, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { BarChart, BarChartPropsType } from "react-native-gifted-charts";
import { AppChartContainer } from "../ui/AppChartContainer";
import { AppChipSelect } from "../ui/AppChipSelect";

export function MonthlyEvolutionChart() {
  const theme = useAppTheme();
  const [months, setMonths] = useState(12);

  const monthlyEvolutionQuery = useMonthlyEvolution({ months: months });
  const scrollViewRef = createRef<ScrollView>();

  const monthlyEvolutionChartMaxValue = useMemo(() => {
    if (!monthlyEvolutionQuery.data) return 0;

    const maxValue = monthlyEvolutionQuery.data.history.reduce((max, item) => (item.balance! > max ? item.balance! : max), 0) || 0;

    return maxValue;
  }, [monthlyEvolutionQuery.data]);

  const monthlyEvolutionChartMinValue = useMemo(() => {
    if (!monthlyEvolutionQuery.data) return 0;

    const minValue = monthlyEvolutionQuery.data.history.reduce((min, item) => (item.balance! < min ? item.balance! : min), 0) || 0;

    return Math.abs(minValue);
  }, [monthlyEvolutionQuery.data]);

  const monthlyEvolutionChartData = useMemo<BarChartPropsType["data"]>(() => {
    return monthlyEvolutionQuery.data?.history.map((item) => {
      return {
        value: item.balance,
        label: item.month,
        barBorderTopLeftRadius: theme.roundness,
        barBorderTopRightRadius: theme.roundness,
        frontColor: item.balance < 0 ? theme.colors.error : theme.colors.success,
      };
    });
  }, [monthlyEvolutionQuery.data?.history, theme.colors.error, theme.colors.success, theme.roundness]);

  return (
    <AppChartContainer className="overflow-hidden">
      <AppChartContainer.Content className="px-0">
        <AppChartContainer.Title>Evolução Mensal</AppChartContainer.Title>

        <View className="w-full px-4">
          <AppChipSelect
            value={months}
            onChange={(months) => setMonths(months)}
            options={[
              {
                label: "6 meses",
                value: 6,
              },
              {
                label: "12 meses",
                value: 12,
              },
              {
                label: "24 meses",
                value: 24,
              },
            ]}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
          onLayout={() => {
            scrollViewRef.current?.scrollToEnd({ animated: false });
          }}
        >
          <BarChart
            disableScroll
            data={monthlyEvolutionChartData}
            maxValue={monthlyEvolutionChartMaxValue}
            mostNegativeValue={monthlyEvolutionChartMinValue}
            noOfSections={4}
            noOfSectionsBelowXAxis={1}
            hideYAxisText
            hideRules
            spacing={30}
            autoShiftLabels
            xAxisLabelTextStyle={{
              color: theme.colors.onSurface,
            }}
            xAxisColor={theme.colors.outlineVariant}
            yAxisColor="transparent"
          />
        </ScrollView>
      </AppChartContainer.Content>
    </AppChartContainer>
  );
}
