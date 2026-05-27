import { Category } from "@/models/Category";
import { $axios } from "@/utils/$axios";
import qs from "qs";

export interface GetExpenseByCategoryArguments {
  filter?: {
    when?: {
      ge?: Date;
      le?: Date;
    };
  };
}

export interface GetExpenseByCategoryReturnType {
  status: {
    totalExpense: number;
    totalIncome: number;
    balance: number;
    totalLimits: number;
    totalScheduled: number;
  };
  categories: Category[];
}

export interface GetMonthlyEvolutionArguments {
  months?: number;
}

export interface GetMonthlyEvolutionReturnType {
  history: {
    month: string;
    totalExpense: number;
    totalIncome: number;
    balance: number;
  }[];
}

export interface GetKpisArguments {
  filter?: {
    when?: {
      ge?: Date;
      le?: Date;
    };
  };
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

  public static async getExpenseByCategory(options: GetExpenseByCategoryArguments): Promise<GetExpenseByCategoryReturnType> {
    const queryString = qs.stringify(options);
    const { data } = await $axios.get(`${this.path}/expense-by-category?${queryString}`);

    return data;
  }

  public static async getMonthlyEvolution(params: GetMonthlyEvolutionArguments): Promise<GetMonthlyEvolutionReturnType> {
    const queryString = qs.stringify(params);
    const { data } = await $axios.get(`${this.path}/monthly-evolution?${queryString}`);

    return data;
  }

  public static async getKpis(options?: GetKpisArguments): Promise<GetKpisReturnType> {
    const queryString = qs.stringify(options);
    const { data } = await $axios.get(`${this.path}/kpis?${queryString}`);

    return data;
  }
}
