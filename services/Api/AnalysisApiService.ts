import { Analysis } from "@/models/Analysis";
import { PaginatedData } from "@/models/PaginatedData";
import { $axios } from "@/utils/$axios";
import qs from "qs";

export type ListAnalysesArguments = {
  query?: {
    page?: number;
    perPage?: number;
    paginated?: boolean;
  };
};

export type CreateAnalysisReturnType = {
  analysis: Analysis;
};

export type UpdateAnalysisReturnType = {
  analysis: Analysis;
};

export type DeleteAnalysisReturnType = {
  analysis: Analysis;
};

export class AnalysisService {
  private static readonly path = "/analyses";

  private static async _list(options?: ListAnalysesArguments): Promise<PaginatedData<Analysis>> {
    const query = qs.stringify(options?.query);
    const { data } = await $axios.get(`${this.path}?${query}`);

    return data;
  }

  private static async _create(): Promise<CreateAnalysisReturnType> {
    const { data } = await $axios.post(`${this.path}`);

    return data;
  }

  private static async _delete(id: Analysis["id"]): Promise<DeleteAnalysisReturnType> {
    const { data } = await $axios.delete(`${this.path}/${id}`);

    return data;
  }

  public static readonly list = AnalysisService._list.bind(AnalysisService);
  public static readonly create = AnalysisService._create.bind(AnalysisService);
  public static readonly delete = AnalysisService._delete.bind(AnalysisService);
}
