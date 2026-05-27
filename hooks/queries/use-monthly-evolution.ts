import { OverviewService } from "@/services/OverviewService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export interface UseMonthlyEvolutionOptions {
  months: number;
}

export const useMonthlyEvolution = (options: UseMonthlyEvolutionOptions) => {
  return useQuery({
    queryKey: QueryKeys.Overview.getMonthlyEvolution(options),
    queryFn: () => OverviewService.getMonthlyEvolution({ months: options.months }),
  });
};
