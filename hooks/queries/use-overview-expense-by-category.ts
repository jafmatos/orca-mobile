import { OverviewService } from "@/services/OverviewService";
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
    queryKey: QueryKeys.Overview.getExpenseByCategory(),
    queryFn: () => OverviewService.getExpenseByCategory({ filter: options?.filter }),
  });
};
