import { useAppTheme } from "@/hooks/use-app-theme";
import { KpiCard } from "./KpiCard";

export interface ExpenseCardProps {
  amount?: number;
  loading?: boolean;
}

export function ExpenseCard(props: ExpenseCardProps) {
  const theme = useAppTheme();

  return <KpiCard title="Despesas" amount={props.amount} icon="triangle-small-down" iconColor={theme.colors.error} loading={props.loading} />;
}
