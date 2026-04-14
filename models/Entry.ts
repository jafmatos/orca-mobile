import { Category } from "./Category";
import { User } from "./User";

export enum EntryTypes {
  Income = "income",
  Expense = "expense",
}

export interface Entry {
  id: string;
  userId: User["id"];
  categoryId: Category["id"];
  type: EntryTypes;
  amount: number;
  description: string;
  when: Date;
  category?: Category;
}
