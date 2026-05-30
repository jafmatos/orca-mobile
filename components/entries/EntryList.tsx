import { useEntries } from "@/hooks/queries/use-entries";
import { Entry } from "@/models/Entry";
import { PaginatedData } from "@/models/PaginatedData";
import { ListEntriesArguments } from "@/services/EntryService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, ListRenderItem, View } from "react-native";
import { EndOfListWithLoading } from "../EndOfListWithLoading";
import { EntryListHeader } from "./EntryListHeader";

export type EntryFilter = Required<ListEntriesArguments>["query"]["filter"];

export interface EntryListProps {
  filter?: EntryFilter;
  renderItem: ListRenderItem<Entry>;
  onRefresh: () => void;
  onFetchSuccess: (data?: PaginatedData<Entry>) => void;
}

export function EntryList(props: EntryListProps) {
  const [filter, setFilter] = useState<EntryFilter>();
  const queryClient = useQueryClient();
  const entryQuery = useEntries({
    filter,
    onSuccess: props.onFetchSuccess,
  });

  useEffect(() => {
    props.onRefresh?.();

    queryClient.resetQueries({
      queryKey: QueryKeys.Entry.getEntries(),
    });
  }, [filter, props.onRefresh, queryClient]);

  const entries = useMemo(() => {
    return entryQuery.data?.pages.reduce((entries, page) => {
      entries.push(...page.data);

      return entries;
    }, [] as Entry[]);
  }, [entryQuery.data?.pages]);

  return (
    <FlatList
      style={{ flex: 1 }}
      ListHeaderComponent={<EntryListHeader onFilterChange={(filter) => setFilter(filter)} />}
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
      data={entries}
      renderItem={props.renderItem}
      ItemSeparatorComponent={() => <View className="h-4" />}
      onEndReached={() => entryQuery.fetchNextPage()}
      onEndReachedThreshold={1}
    />
  );
}
