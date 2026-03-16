import { EntryService } from "@/services/EntryService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useEntries = () => {
  const entriesQuery = useInfiniteQuery({
    queryKey: QueryKeys.Entry.getEntries(),
    queryFn: async ({ pageParam }) => {
      return await EntryService.getEntries({
        query: {
          page: pageParam,
          perPage: 10,
        },
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page === lastPage.meta.pages) return;

      return lastPage.meta.page + 1;
    },
    initialPageParam: 1,
  });

  return entriesQuery;
};
