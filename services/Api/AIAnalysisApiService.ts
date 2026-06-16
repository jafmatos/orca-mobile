import { AIAnalysis } from "@/models/AIAnalysis";
import { PaginatedData } from "@/models/PaginatedData";
import { $axios } from "@/utils/$axios";
import qs from "qs";

export type ListAIAnalysesArguments = {
  query?: {
    page?: number;
    perPage?: number;
    paginated?: boolean;
  };
};

export type CreateAIAnalysisReturnType = {
  analysis: AIAnalysis;
};

export type UpdateAIAnalysisReturnType = {
  analysis: AIAnalysis;
};

export type DeleteAIAnalysisReturnType = {
  analysis: AIAnalysis;
};

export class AIAnalysisService {
  private static readonly path = "/analyses";

  private static async _list(options?: ListAIAnalysesArguments): Promise<PaginatedData<AIAnalysis>> {
    const query = qs.stringify(options?.query);
    const { data } = await $axios.get(`${this.path}?${query}`);

    return data;
  }

  private static async _create(): Promise<CreateAIAnalysisReturnType> {
    const { data } = await $axios.post(`${this.path}`);

    return data;
  }

  private static async _delete(id: AIAnalysis["id"]): Promise<DeleteAIAnalysisReturnType> {
    const { data } = await $axios.delete(`${this.path}/${id}`);

    return data;
  }

  public static readonly list = AIAnalysisService._list.bind(AIAnalysisService);
  public static readonly create = AIAnalysisService._create.bind(AIAnalysisService);
  public static readonly delete = AIAnalysisService._delete.bind(AIAnalysisService);
}
