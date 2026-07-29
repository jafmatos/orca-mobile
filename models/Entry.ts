import { Category } from "./Category";
import { ScheduleOccurrence } from "./ScheduleOccurrence";
import { User } from "./User";

export enum EntryTypes {
  Income = "income",
  Expense = "expense",
}

export interface Entry {
  id: string;
  userId: User["id"];
  categoryId?: Category["id"] | null;
  type: EntryTypes;
  amount: number;
  description?: string;
  when: string;
  createdAt: string;
  category?: Category | null;
  user?: User;
  occurrence?: ScheduleOccurrence;
}
