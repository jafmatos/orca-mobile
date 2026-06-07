import { ScheduleService } from "@/services/Api/ScheduleApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface UseSchedulesOptions {
  onSuccess?: (data?: any) => void;
}

export const useSchedules = (options?: UseSchedulesOptions) => {
  return useInfiniteQuery({
    queryKey: QueryKeys.Schedule.getSchedules(),
    queryFn: async ({ pageParam }) => {
      const data = await ScheduleService.list({ page: pageParam });

      options?.onSuccess?.(data);

      return data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage) return 1;
      if (lastPage.meta.page >= lastPage.meta.pages) return;

      return lastPage.meta.page + 1;
    },
    initialPageParam: 1,
  });
};
