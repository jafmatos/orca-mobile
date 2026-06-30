import { Plan } from "@/models/Plan";
import { $axios } from "@/utils/$axios";

export type GetPlansReturnType = {
  plans: Plan[];
};

export class PlanApiService {
  private static readonly path = "/plans";

  static async getPlans(): Promise<GetPlansReturnType> {
    const { data } = await $axios.get(`${this.path}`);

    return data;
  }
}
