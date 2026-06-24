import { Entry } from "@/models/Entry";
import { CursorPaginatedData } from "@/models/PaginatedData";
import { EntryService, ListEntriesArguments } from "@/services/Api/EntryApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface UseEntriesOptions {
  filter?: NonNullable<NonNullable<ListEntriesArguments>["query"]>["filter"];
  onSuccess?: (data?: CursorPaginatedData<Entry>) => void;
}

export const useEntries = (options?: UseEntriesOptions) => {
  const entriesQuery = useInfiniteQuery({
    queryKey: QueryKeys.Entry.getEntries(options?.filter),
    queryFn: async ({ pageParam }) => {
      const data = await EntryService.list({
        query: {
          cursor: pageParam || undefined,
          perPage: 10,
          filter: options?.filter,
        },
      });

      options?.onSuccess?.(data);

      return data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta.nextCursor) return;

      return lastPage.meta.nextCursor;
    },
    initialPageParam: "",
  });

  return entriesQuery;
};
