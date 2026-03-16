export enum CategoryTypes {
  Income = "income",
  Expense = "expense",
}

export interface Category {
  id: string;
  type: CategoryTypes;
  name: string;
  userId: string;
}
