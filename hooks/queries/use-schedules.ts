import { ScheduleService } from "@/services/Api/ScheduleApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export interface UseSchedulesOptions {
  onSuccess?: (data?: any) => void;
}

export const useSchedules = (options?: UseSchedulesOptions) => {
  return useQuery({
    queryKey: QueryKeys.Schedule.getSchedules(),
    queryFn: async () => {
      const data = await ScheduleService.list({ paginated: false });

      options?.onSuccess?.(data);

      return data;
    },
  });
};
