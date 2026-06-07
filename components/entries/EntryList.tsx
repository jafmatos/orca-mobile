import { useEntries } from "@/hooks/queries/use-entries";
import { Entry } from "@/models/Entry";
import { PaginatedData } from "@/models/PaginatedData";
import { ListEntriesArguments } from "@/services/Api/EntryApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import { FlatList, View } from "react-native";
import { EndOfListWithLoading } from "../EndOfListWithLoading";

export type EntryFilter = Required<ListEntriesArguments>["query"]["filter"];

export interface EntryListProps extends React.ComponentProps<typeof FlatList<Entry>> {
  filter?: EntryFilter;
  onRefresh?: () => void;
  onFetchSuccess?: (data?: PaginatedData<Entry>) => void;
}

export function EntryList({ filter, onRefresh, onFetchSuccess, ...props }: EntryListProps) {
  const queryClient = useQueryClient();
  const entryQuery = useEntries({
    filter,
    onSuccess: onFetchSuccess,
  });

  useEffect(() => {
    onRefresh?.();

    queryClient.resetQueries({
      queryKey: QueryKeys.Entry.getEntries(filter),
      exact: true,
    });
  }, [filter, onRefresh, queryClient]);

  const entries = useMemo(() => {
    return entryQuery.data?.pages.reduce((entries, page) => {
      entries.push(...page.data);

      return entries;
    }, [] as Entry[]);
  }, [entryQuery.data?.pages]);

  return (
    <FlatList
      style={{ flex: 1 }}
      ListFooterComponent={
        <EndOfListWithLoading
          isLoading={entryQuery.isPending || entryQuery.isFetchingNextPage}
          isOnEnd={!entryQuery.isPending && !entryQuery.isFetchingNextPage && !entryQuery.hasNextPage}
          isEmpty={!entryQuery.isPending && !entryQuery.isFetching && entries?.length === 0}
          endOfListText="Não há mais lançamentos"
          emptyListText="Não há lançamentos"
        />
      }
      contentContainerClassName="p-4"
      ItemSeparatorComponent={() => <View className="h-4" />}
      onEndReached={() => entryQuery.fetchNextPage()}
      onEndReachedThreshold={1}
      {...props}
    />
  );
}
