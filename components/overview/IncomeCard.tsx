import { useAppTheme } from "@/hooks/use-app-theme";
import { KpiCard } from "./KpiCard";

export interface IncomeCardProps {
  amount?: number;
}

export function IncomeCard(props: IncomeCardProps) {
  const theme = useAppTheme();

  return <KpiCard title="Receitas" icon="triangle-small-up" iconColor={theme.colors.success} amount={props.amount} />;
}
