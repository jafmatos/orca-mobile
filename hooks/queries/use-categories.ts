import { CategoryService } from "@/services/CategoryService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  const categoriesQuery = useQuery({
    queryKey: QueryKeys.Category.getCategories(),
    queryFn: async () => {
      return await CategoryService.getCategories({
        query: {
          paginated: false,
        },
      });
    },
  });

  return categoriesQuery;
};
