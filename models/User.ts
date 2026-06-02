import { Subscription } from "./Subscription";
import { UserAvatar } from "./UserAvatar";

export interface User {
  id: string;
  email: string;
  name: string;
  balance?: number;
  periodGe: string;
  periodLe: string;
  periodReferenceDay: number;
  acceptsNotifications: boolean;
  createdAt: string;
  avatar?: UserAvatar;
  subscription?: Subscription;
}
