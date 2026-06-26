import { Plan } from "./Plan";

export enum SubscriptionStatus {
  Trialing = "trialing",
  Active = "active",
  PastDue = "past_due",
  Canceled = "canceled",
  Unpaid = "unpaid",
  Paused = "paused",
}

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  traducedStatus: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart?: string;
  trialEnd?: string;
  isActive: boolean;
  plan: Plan;
  createdAt: string;
}
