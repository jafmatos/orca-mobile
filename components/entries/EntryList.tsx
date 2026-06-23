import { useEntries } from "@/hooks/queries/use-entries";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Entry } from "@/models/Entry";
import { PaginatedData } from "@/models/PaginatedData";
import { ListEntriesArguments } from "@/services/Api/EntryApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { EndOfListWithLoading } from "../EndOfListWithLoading";
import { AppErrorState } from "../ui/AppErrorState";
import { AppKeyboardDismissing } from "../ui/AppKeyboardDismissing";

export type EntryFilter = Required<ListEntriesArguments>["query"]["filter"];

export interface EntryListProps extends Omit<React.ComponentProps<typeof FlatList<Entry>>, "data"> {
  filter?: EntryFilter;
  onRefresh?: () => void;
  onFetchSuccess?: (data?: PaginatedData<Entry>) => void;
}

export function EntryList({ filter, onRefresh, onFetchSuccess, ...props }: EntryListProps) {
  const queryClient = useQueryClient();
  const theme = useAppTheme();
  const entryQuery = useEntries({
    filter,
    onSuccess: onFetchSuccess,
  });

  const handleRefresh = async () => {
    onRefresh?.();

    await queryClient.resetQueries({
      queryKey: QueryKeys.Entry.getEntries(filter),
      exact: true,
    });
  };

  const entries = useMemo(() => {
    return entryQuery.data?.pages.reduce((entries, page) => {
      entries.push(...page.data);

      return entries;
    }, [] as Entry[]);
  }, [entryQuery.data?.pages]);

  if (entryQuery.isError && (!entries || entries.length === 0)) {
    return <AppErrorState message={entryQuery.error?.message} onRetry={() => entryQuery.refetch()} />;
  }

  return (
    <AppKeyboardDismissing.FlatList
      style={{ flex: 1 }}
      data={entries}
      ListFooterComponent={
        <EndOfListWithLoading
          isLoading={entryQuery.isPending || entryQuery.isFetchingNextPage}
          isOnEnd={!entryQuery.isPending && !entryQuery.isFetchingNextPage && !entryQuery.hasNextPage}
          isEmpty={!entryQuery.isPending && !entryQuery.isFetching && entries?.length === 0 && !entryQuery.isError}
          endOfListText="Não há mais lançamentos"
          emptyListText="Não há lançamentos"
        />
      }
      contentContainerClassName="p-4"
      ItemSeparatorComponent={() => <View className="h-4" />}
      onEndReached={() => entryQuery.fetchNextPage()}
      onEndReachedThreshold={1}
      refreshControl={
        <RefreshControl
          refreshing={entryQuery.isRefetching && !entryQuery.isFetchingNextPage}
          onRefresh={handleRefresh}
          colors={[theme.colors.primary]}
          progressBackgroundColor={theme.colors.surface}
          tintColor={theme.colors.primary}
        />
      }
      {...props}
    />
  );
}
