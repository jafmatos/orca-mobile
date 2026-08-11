import { useSchedules } from "@/hooks/queries/use-schedules";
import { PaginatedData } from "@/models/PaginatedData";
import { Schedule } from "@/models/Schedule";
import { useMemo } from "react";
import { FlatList, ListRenderItem, View } from "react-native";
import { EndOfListWithLoading } from "../EndOfListWithLoading";
import { AppErrorState } from "../ui/AppErrorState";
import { AppKeyboardDismissing } from "../utils/AppKeyboardDismissing";

export interface ScheduleListProps extends Partial<React.ComponentProps<typeof FlatList<Schedule>>> {
  renderItem: ListRenderItem<Schedule>;
  onFetchSuccess?: (data?: PaginatedData<Schedule>) => void;
}

export function ScheduleList(props: ScheduleListProps) {
  const schedulesQuery = useSchedules({
    onSuccess: props.onFetchSuccess,
  });

  const schedules = useMemo(() => schedulesQuery.data?.data || [], [schedulesQuery.data]);

  if (schedulesQuery.isError && schedules?.length === 0) {
    return <AppErrorState message={schedulesQuery.error?.message} onRetry={() => schedulesQuery.refetch()} />;
  }

  return (
    <AppKeyboardDismissing.FlatList
      style={{ flex: 1 }}
      contentContainerClassName="p-4"
      ItemSeparatorComponent={() => <View className="h-4" />}
      data={schedules}
      renderItem={props.renderItem}
      ListHeaderComponent={props.ListHeaderComponent}
      ListFooterComponent={
        <EndOfListWithLoading
          isLoading={schedulesQuery.isPending}
          isOnEnd={!schedulesQuery.isPending}
          isEmpty={!schedulesQuery.isPending && !schedulesQuery.isFetching && schedules?.length === 0}
          endOfListText="Não há mais agendamentos"
          emptyListText="Não há agendamentos"
        />
      }
    />
  );
}
