export type PaginatedData<T> = {
  data: T[];
  meta: {
    count: number;
    page: number;
    perPage: number;
    pages: number;
  };
};
