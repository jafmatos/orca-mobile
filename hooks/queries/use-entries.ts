import { EntryService, GetEntriesArguments } from "@/services/EntryService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface UseEntriesOptions {
  filter?: NonNullable<NonNullable<GetEntriesArguments>["query"]>["filter"];
}

export const useEntries = (options?: UseEntriesOptions) => {
  const entriesQuery = useInfiniteQuery({
    queryKey: QueryKeys.Entry.getEntries(),
    queryFn: async ({ pageParam }) => {
      return await EntryService.getEntries({
        query: {
          page: pageParam,
          perPage: 10,
          filter: options?.filter,
        },
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page >= lastPage.meta.pages) return;

      return lastPage.meta.page + 1;
    },
    initialPageParam: 1,
  });

  return entriesQuery;
};
