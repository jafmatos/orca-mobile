import { Analysis } from "@/models/Analysis";
import { PaginatedData } from "@/models/PaginatedData";
import { AnalysisService, ListAnalysesArguments } from "@/services/Api/AnalysisApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface UseAnalysesOptions {
  onSuccess?: (data?: PaginatedData<Analysis>) => void;
  variables?: ListAnalysesArguments;
}

export const useAnalyses = (options?: UseAnalysesOptions) => {
  return useInfiniteQuery({
    queryKey: QueryKeys.Analysis.getAnalyses(),
    queryFn: async ({ pageParam = 1 }) => {
      const data = await AnalysisService.list({
        query: {
          page: pageParam,
          perPage: 10,
          paginated: true,
          ...options?.variables?.query,
        },
      });

      if (options?.onSuccess) {
        options.onSuccess(data);
      }

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.pages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
  });
};
