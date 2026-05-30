import { Category, CategoryTypes } from "@/models/Category";
import { PaginatedData } from "@/models/PaginatedData";
import { $axios } from "@/utils/$axios";
import qs from "qs";

export type ListCategoriesArguments = {
  query?: {
    page?: number;
    perPage?: number;
    paginated?: boolean;
  };
};

export type CreateCategoryBody = {
  name: string;
  type: CategoryTypes;
  limit?: {
    id?: string;
    amount: number;
  } | null;
};

export type CreateCategoryReturnType = {
  category: Category;
};

export type UpdateCategoryBody = {
  name?: string;
  type?: CategoryTypes;
  limit?: {
    id?: string;
    amount: number;
  } | null;
};

export type UpdateCategoryReturnType = {
  category: Category;
};

export type DeleteCategoryReturnType = {
  category: Category;
};

export class CategoryService {
  private static readonly path = "/categories";

  private static async _list(options?: ListCategoriesArguments): Promise<PaginatedData<Category>> {
    const query = qs.stringify(options?.query);
    const { data } = await $axios.get(`${this.path}?${query}`);

    return data;
  }

  private static async _create(body: CreateCategoryBody): Promise<CreateCategoryReturnType> {
    const { data } = await $axios.post(`${this.path}`, body);

    return data;
  }

  private static async _update(id: Category["id"], body: UpdateCategoryBody): Promise<UpdateCategoryReturnType> {
    const { data } = await $axios.put(`${this.path}/${id}`, body);

    return data;
  }

  private static async _delete(id: Category["id"]): Promise<DeleteCategoryReturnType> {
    const { data } = await $axios.delete(`${this.path}/${id}`);

    return data;
  }

  public static readonly list = CategoryService._list.bind(CategoryService);
  public static readonly create = CategoryService._create.bind(CategoryService);
  public static readonly update = CategoryService._update.bind(CategoryService);
  public static readonly delete = CategoryService._delete.bind(CategoryService);
}
