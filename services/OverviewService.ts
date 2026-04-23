import { Category } from "@/models/Category";
import { $axios } from "@/utils/$axios";

export interface GetExpenseByCategoryReturnType {
  status: {
    totalExpense: number;
    totalIncome: number;
    balance: number;
    totalLimits: number;
    totalScheduled: number;
  };
  categories: (Category & { spent: number })[];
}

export interface GetMonthlyEvolutionReturnType {
  history: {
    month: string;
    totalExpense: number;
    totalIncome: number;
    balance: number;
  }[];
}

export interface GetKpisReturnType {
  status: {
    totalExpense: number;
    totalIncome: number;
    balance: number;
    totalLimits: number;
    totalScheduled: number;
  };
}

export class OverviewService {
  private static readonly path = "/users/overview";

  public static async getExpenseByCategory(): Promise<GetExpenseByCategoryReturnType> {
    const { data } = await $axios.get(
      `${this.path}/expense-by-category`,
    );

    return data;
  }

  public static async getMonthlyEvolution(): Promise<GetMonthlyEvolutionReturnType> {
    const { data } = await $axios.get(`${this.path}/monthly-evolution`);

    return data;
  }

  public static async getKpis(): Promise<GetKpisReturnType> {
    const { data } = await $axios.get(`${this.path}/kpis`);

    return data;
  }
}
