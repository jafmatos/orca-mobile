export type PaginatedData<T> = {
  data: T[];
  meta: {
    count: number;
    page: number;
    perPage: number;
    pages: number;
  };
};

export type CursorPaginatedData<T> = {
  data: T[];
  meta: {
    nextCursor: string | null;
    take: number;
  };
};
