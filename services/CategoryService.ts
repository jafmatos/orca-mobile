import { Category } from "@/models/Category";
import { PaginatedData } from "@/models/PaginatedData";
import { $axios } from "@/utils/$axios";
import qs from "qs";

export type GetCategoriesArguments = {
  query?: {
    page?: number;
    perPage?: number;
    paginated?: boolean;
  };
};

export class CategoryService {
  private static readonly path = "/categories";

  private static async _getCategories(options?: GetCategoriesArguments): Promise<PaginatedData<Category>> {
    const query = qs.stringify(options?.query);
    const { data } = await $axios.get(`${this.path}?${query}`);

    return data;
  }

  public static readonly getCategories = CategoryService._getCategories.bind(CategoryService);
}
