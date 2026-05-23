import ExpenseByCategoryChart from "@/components/charts/ExpenseByCategoryChart";
import { LimitsMonitorChart } from "@/components/charts/LimitsMonitorChart";
import { MonthlyEvolutionChart } from "@/components/charts/MonthlyEvolutionChart";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { ScrollView } from "react-native";

export default function DashboardScreen() {
  return (
    <TabbedLayout>
      <ScrollView style={{ flex: 1 }} contentContainerClassName="p-4 flex gap-4">
        <MonthlyEvolutionChart />
        <LimitsMonitorChart />
        <ExpenseByCategoryChart />
      </ScrollView>
    </TabbedLayout>
  );
}
