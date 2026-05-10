import { Entry } from "@/models/Entry";
import { PaginatedData } from "@/models/PaginatedData";
import { EntryService, ListEntriesArguments } from "@/services/EntryService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export interface UseEntriesOptions {
  filter?: NonNullable<NonNullable<ListEntriesArguments>["query"]>["filter"];
  onSuccess?: (data?: PaginatedData<Entry>) => void;
}

export const useEntries = (options?: UseEntriesOptions) => {
  const entriesQuery = useInfiniteQuery({
    queryKey: QueryKeys.Entry.getEntries(),
    queryFn: async ({ pageParam }) => {
      const data = await EntryService.list({
        query: {
          page: pageParam,
          perPage: 10,
          filter: options?.filter,
        },
      });

      options?.onSuccess?.(data);

      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page >= lastPage.meta.pages) return;

      return lastPage.meta.page + 1;
    },
    initialPageParam: 1,
  });


  return entriesQuery;
};
