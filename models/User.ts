import { Subscription } from "./Subscription";
import { UserAvatar } from "./UserAvatar";

export interface User {
  id: string;
  email: string;
  name: string;
  balance?: number;
  salaryDay: number;
  currentCycle: {
    start: string;
    end: string;
  };
  financialGoal?: string | null;
  acceptsNotifications: boolean;
  createdAt: string;
  avatar?: UserAvatar;
  subscription?: Subscription;
}
