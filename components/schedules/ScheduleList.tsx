import { Schedule } from "@/models/Schedule";
import { useSchedules } from "@/hooks/queries/use-schedules";
import { FlatList, ListRenderItem, View } from "react-native";
import { EndOfListWithLoading } from "../EndOfListWithLoading";
import { useMemo } from "react";
import { PaginatedData } from "@/models/PaginatedData";

export interface ScheduleListProps extends Partial<React.ComponentProps<typeof FlatList<Schedule>>> {
  renderItem: ListRenderItem<Schedule>;
  onFetchSuccess?: (data?: PaginatedData<Schedule>) => void;
}

export function ScheduleList(props: ScheduleListProps) {
  const schedulesQuery = useSchedules({
    onSuccess: props.onFetchSuccess,
  });

  const schedules = useMemo(() => schedulesQuery.data?.pages.flatMap((page) => page.data) || [], [schedulesQuery.data]);

  return (
    <FlatList
      style={{ flex: 1 }}
      contentContainerClassName="p-4"
      ItemSeparatorComponent={() => <View className="h-4" />}
      data={schedules}
      renderItem={props.renderItem}
      ListHeaderComponent={props.ListHeaderComponent}
      ListFooterComponent={
        <EndOfListWithLoading
          isLoading={schedulesQuery.isPending || schedulesQuery.isFetchingNextPage}
          isOnEnd={!schedulesQuery.isPending && !schedulesQuery.isFetchingNextPage && !schedulesQuery.hasNextPage}
          isEmpty={!schedulesQuery.isPending && !schedulesQuery.isFetching && schedules?.length === 0}
          endOfListText="Não há mais agendamentos"
          emptyListText="Não há agendamentos"
          // isError={schedulesQuery.isError}
          // error={schedulesQuery.error}
        />
      }
      onEndReached={() => schedulesQuery.fetchNextPage()}
      onEndReachedThreshold={1}
    />
  );
}
