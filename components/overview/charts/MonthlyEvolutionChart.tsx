import { useMonthlyEvolution } from "@/hooks/queries/use-monthly-evolution";
import { useAppTheme } from "@/hooks/use-app-theme";
import { createRef, useMemo, useState, useEffect } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { AppChartContainer } from "@/components/ui/AppChartContainer";
import { AppChipSelect } from "@/components/ui/AppChipSelect";
import { Text, Divider, Icon } from "react-native-paper";
import { AppHideableCurrencyText } from "@/components/ui/AppHideableCurrencyText";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { AppTextSwitch } from "@/components/ui/AppTextSwitch";

export enum MonthlyEvolutionChartMode {
  Balance = "balance",
  Cashflow = "cashflow",
}

export function MonthlyEvolutionChart() {
  const theme = useAppTheme();
  const [months, setMonths] = useState(12);
  const [chartMode, setChartMode] = useState<MonthlyEvolutionChartMode>(MonthlyEvolutionChartMode.Balance);
  const [selectedItem, setSelectedItem] = useState<{
    month: string;
    totalIncome: number;
    totalExpense: number;
    balance: number;
  } | null>(null);

  const monthlyEvolutionQuery = useMonthlyEvolution({ months: months });
  const scrollViewRef = createRef<ScrollView>();

  const historyData = monthlyEvolutionQuery.data?.history;

  useEffect(() => {
    if (historyData && historyData.length > 0) {
      const lastItem = historyData[historyData.length - 1];
      setSelectedItem({
        month: lastItem.month,
        totalIncome: lastItem.totalIncome,
        totalExpense: lastItem.totalExpense,
        balance: lastItem.balance,
      });
    } else {
      setSelectedItem(null);
    }
  }, [historyData]);

  const selectedMonthIndex = useMemo(() => {
    if (!selectedItem || !historyData) return -1;
    return historyData.findIndex((h) => h.month === selectedItem.month);
  }, [selectedItem, historyData]);

  const lineChartData = useMemo(() => {
    if (!historyData) return [];
    return historyData.map((item) => ({
      value: item.balance,
      label: item.month,
      onPress: () => {
        setSelectedItem({
          month: item.month,
          totalIncome: item.totalIncome,
          totalExpense: item.totalExpense,
          balance: item.balance,
        });
      },
    }));
  }, [historyData]);

  const lineChartSectionProps = useMemo(() => {
    const defaultProps = {
      height: 160,
      noOfSections: 3,
      noOfSectionsBelowXAxis: 0,
      stepHeight: 53.3,
      stepValue: undefined as number | undefined,
    };

    if (!historyData || historyData.length === 0) {
      return defaultProps;
    }

    const balances = historyData.map((h) => h.balance);
    const maxVal = Math.max(...balances, 0);
    const minVal = Math.abs(Math.min(...balances, 0));

    if (maxVal === 0 && minVal === 0) {
      return defaultProps;
    }

    const targetTotalHeight = 160;
    const range = Math.max(maxVal, minVal);
    const magnitude = Math.pow(10, Math.floor(Math.log10(range || 1)));
    const multipliers = [0.1, 0.2, 0.25, 0.5, 1.0, 2.0, 5.0, 10.0];
    const candidates = multipliers.map((m) => m * magnitude);

    let bestCandidate = candidates[4];
    let bestScore = Infinity;

		for (const stepVal of candidates) {
      const posSec = Math.ceil(maxVal / stepVal);
      const negSec = Math.ceil(minVal / stepVal);
      const totalSec = posSec + negSec;

      if (totalSec >= 4 && totalSec <= 10) {
        const emptySpace = (posSec * stepVal - maxVal) + (negSec * stepVal - minVal);
        const emptyRatio = emptySpace / (totalSec * stepVal);
        
        const score = emptyRatio * 2 + Math.abs(totalSec - 6) * 0.1;
        if (score < bestScore) {
          bestScore = score;
          bestCandidate = stepVal;
        }
      }
    }

    if (bestScore === Infinity) {
      let closestDiff = Infinity;
      for (const stepVal of candidates) {
        const posSec = Math.ceil(maxVal / stepVal);
        const negSec = Math.ceil(minVal / stepVal);
        const totalSec = posSec + negSec;
        const diff = Math.abs(totalSec - 6);
        if (diff < closestDiff) {
          closestDiff = diff;
          bestCandidate = stepVal;
        }
      }
    }

    const stepValue = bestCandidate;
    const noOfSections = Math.ceil(maxVal / stepValue) || 1;
    const noOfSectionsBelowXAxis = Math.ceil(minVal / stepValue);
    const totalSections = noOfSections + noOfSectionsBelowXAxis;

    const stepHeight = targetTotalHeight / totalSections;
    const height = noOfSections * stepHeight;

    return {
      height,
      noOfSections,
      noOfSectionsBelowXAxis,
      stepHeight,
      stepValue,
    };
  }, [historyData]);

  const cashflowChartData = useMemo(() => {
    if (!historyData) return [];
    const data: any[] = [];

    historyData.forEach((item) => {
      const onPress = () => {
        setSelectedItem({
          month: item.month,
          totalIncome: item.totalIncome,
          totalExpense: item.totalExpense,
          balance: item.balance,
        });
      };

      data.push({
        value: item.totalIncome,
        labelComponent: () => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={{ width: 36, alignItems: "center", marginLeft: 2, paddingVertical: 4 }}
          >
            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}>{item.month}</Text>
          </TouchableOpacity>
        ),
        labelWidth: 36,
        frontColor: theme.colors.primary,
        barBorderTopLeftRadius: theme.roundness,
        barBorderTopRightRadius: theme.roundness,
        spacing: 4,
        onPress,
      });

      data.push({
        value: item.totalExpense,
        frontColor: theme.colors.outlineVariant,
        barBorderTopLeftRadius: theme.roundness,
        barBorderTopRightRadius: theme.roundness,
        spacing: 20,
        onPress,
      });
    });

    return data;
  }, [historyData, theme.colors.primary, theme.colors.outlineVariant, theme.colors.onSurfaceVariant, theme.roundness]);

  return (
    <AppChartContainer className="overflow-hidden">
      <AppChartContainer.Content className="px-0 flex gap-4">
        <AppChartContainer.Title className="px-4 align-self-start">Evolução Mensal</AppChartContainer.Title>

        <View className="w-full px-4">
          <AppChipSelect
            value={months}
            onChange={(months) => setMonths(months)}
            options={[
              { label: "6 meses", value: 6 },
              { label: "12 meses", value: 12 },
              { label: "24 meses", value: 24 },
            ]}
          />
        </View>

        <AppTextSwitch<MonthlyEvolutionChartMode>
          className="mx-4"
          value={chartMode}
          onChange={(chartMode) => setChartMode(chartMode)}
          options={[
            { label: "Saldo Líquido", value: MonthlyEvolutionChartMode.Balance },
            { label: "Fluxo de Caixa", value: MonthlyEvolutionChartMode.Cashflow },
          ]}
        />

        <View className="w-full">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            onContentSizeChange={() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}
          >
            {chartMode === "balance" ? (
              <LineChart
                disableScroll
                areaChart
                curved
                data={lineChartData}
                height={lineChartSectionProps.height}
                noOfSections={lineChartSectionProps.noOfSections}
                noOfSectionsBelowXAxis={lineChartSectionProps.noOfSectionsBelowXAxis}
                stepHeight={lineChartSectionProps.stepHeight}
                stepValue={lineChartSectionProps.stepValue}
                spacing={60}
                color={theme.colors.primary}
                thickness={3}
                startFillColor={theme.colors.primary}
                endFillColor="transparent"
                startOpacity={0.2}
                endOpacity={0.01}
                hideYAxisText
                yAxisColor="transparent"
                xAxisColor={theme.colors.outlineVariant}
                hideRules
                dataPointsColor={theme.colors.primary}
                dataPointsRadius={4}
                xAxisLabelTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
                focusEnabled
                onFocus={(item: any, index: number) => {
                  if (historyData && historyData[index]) {
                    const selected = historyData[index];
										
                    setSelectedItem({
                      month: selected.month,
                      totalIncome: selected.totalIncome,
                      totalExpense: selected.totalExpense,
                      balance: selected.balance,
                    });
                  }
                }}
                focusedDataPointRadius={6}
                focusedDataPointColor={theme.colors.primary}
                unFocusOnPressOut={false}
                xAxisLabelsAtBottom={true}
                labelsExtraHeight={0}
              />
            ) : (
              <View style={{ position: "relative" }}>
                <BarChart
                  disableScroll
                  data={cashflowChartData}
                  height={160}
                  barWidth={16}
                  initialSpacing={20}
                  hideYAxisText
                  yAxisColor="transparent"
                  xAxisColor={theme.colors.outlineVariant}
                  hideRules
                  noOfSections={3}
                  xAxisLabelTextStyle={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}
                  highlightEnabled
                  highlightedBarIndex={selectedMonthIndex === -1 ? -1 : [2 * selectedMonthIndex, 2 * selectedMonthIndex + 1]}
                  lowlightOpacity={0.45}
                />

                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 20 + (historyData?.length || 0) * 56,
                    height: 220,
                    flexDirection: "row",
                    paddingLeft: 20,
                    zIndex: 9999,
                  }}
                  pointerEvents="box-none"
                >
                  {historyData &&
                    historyData.map((item, index) => {
                      const onPress = () => {
                        setSelectedItem({
                          month: item.month,
                          totalIncome: item.totalIncome,
                          totalExpense: item.totalExpense,
                          balance: item.balance,
                        });
                      };

                      return (
                        <TouchableOpacity
                          key={item.month}
                          activeOpacity={0.8}
                          onPress={onPress}
                          style={{
                            width: 56,
                            height: "100%",
                          }}
                        />
                      );
                    })}
                </View>
              </View>
            )}
          </ScrollView>
        </View>

        {selectedItem && (
          <View className="w-full px-4 flex flex-col gap-4">
            <Text variant="titleMedium">Detalhamento de {selectedItem.month}</Text>

            <View className="flex flex-row justify-between items-center">
              <Text variant="bodyMedium">Receitas</Text>

              <AppHideableCurrencyText variant="bodyMedium">{currencyFormatter.format(selectedItem.totalIncome)}</AppHideableCurrencyText>
            </View>

            <View className="flex flex-row justify-between items-center">
              <Text variant="bodyMedium">Despesas</Text>

              <AppHideableCurrencyText variant="bodyMedium" style={{ color: theme.colors.error }}>
                - {currencyFormatter.format(selectedItem.totalExpense)}
              </AppHideableCurrencyText>
            </View>

            <Divider />

            <View className="flex flex-row justify-between items-center">
              <View className="h-6 flex flex-row items-center gap-2">
                <Text variant="bodyMedium">Saldo Líquido</Text>

                <Icon
                  size={24}
                  source={selectedItem.balance < 0 ? "triangle-small-down" : "triangle-small-up"}
                  color={selectedItem.balance < 0 ? theme.colors.error : theme.colors.success}
                />
              </View>

              <AppHideableCurrencyText
                variant="bodyMedium"
                style={{
                  color: selectedItem.balance < 0 ? theme.colors.error : theme.colors.success,
                }}
              >
                {currencyFormatter.format(selectedItem.balance)}
              </AppHideableCurrencyText>
            </View>
          </View>
        )}
      </AppChartContainer.Content>
    </AppChartContainer>
  );
}
