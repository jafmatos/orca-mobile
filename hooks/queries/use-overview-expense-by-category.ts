import { OverviewService } from "@/services/OverviewService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useOverviewExpenseByCategory = () => {
  return useQuery({
    queryKey: QueryKeys.Overview.getExpenseByCategory(),
    queryFn: () => OverviewService.getExpenseByCategory(),
  });
};
