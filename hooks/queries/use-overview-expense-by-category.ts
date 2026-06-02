import { OverviewService } from "@/services/Api/OverviewApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export interface UseOverviewExpenseByCategoryOptions {
  filter?: {
    when?: {
      ge?: Date;
      le?: Date;
    };
  };
}

export const useOverviewExpenseByCategory = (options?: UseOverviewExpenseByCategoryOptions) => {
  return useQuery({
    queryKey: QueryKeys.Overview.getExpenseByCategory(options),
    queryFn: () => OverviewService.getExpenseByCategory({ filter: options?.filter }),
  });
};
