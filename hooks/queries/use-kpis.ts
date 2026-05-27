import { GetKpisArguments, OverviewService } from "@/services/OverviewService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useKpis = (options?: GetKpisArguments) => {
  return useQuery({
    queryKey: QueryKeys.Overview.getKpis(options),
    queryFn: () => OverviewService.getKpis(options),
  });
};
