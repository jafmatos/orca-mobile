import { CategoryService } from "@/services/Api/CategoryApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  const categoriesQuery = useQuery({
    queryKey: QueryKeys.Category.getCategories(),
    queryFn: async () => {
      return await CategoryService.list({
        query: {
          paginated: false,
        },
      });
    },
  });

  return categoriesQuery;
};
