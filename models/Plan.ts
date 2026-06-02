export enum PlanDurationInterval {
  Yearly = "yearly",
  Monthly = "monthly",
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  trialPeriodDays?: number;
  benefits: string[];
  duration: {
    interval: PlanDurationInterval;
    intervalCount: number;
  };
}
