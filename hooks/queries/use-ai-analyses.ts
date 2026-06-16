import { AIAnalysisService, ListAIAnalysesArguments } from "@/services/Api/AIAnalysisApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AIAnalysis } from "@/models/AIAnalysis";
import { PaginatedData } from "@/models/PaginatedData";

export interface UseAIAnalysesOptions {
  onSuccess?: (data?: PaginatedData<AIAnalysis>) => void;
  variables?: ListAIAnalysesArguments;
}

export const useAIAnalyses = (options?: UseAIAnalysesOptions) => {
  return useInfiniteQuery({
    queryKey: QueryKeys.AIAnalysis.getAnalyses(),
    queryFn: async ({ pageParam = 1 }) => {
      const data = await AIAnalysisService.list({
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
      if (lastPage.meta.currentPage < lastPage.meta.lastPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
  });
};
