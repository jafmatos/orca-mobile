import { KpiCard } from "./KpiCard";

export interface LimitsCardProps {
  amount?: number;
}

export function LimitsCard(props: LimitsCardProps) {
  return <KpiCard title="Limite" amount={props.amount} />;
}
