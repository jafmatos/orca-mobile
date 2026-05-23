import { useCategories } from "@/hooks/queries/use-categories";
import { FlatList } from "react-native-gesture-handler";
import { EndOfListWithLoading } from "../EndOfListWithLoading";
import { ListRenderItem, View } from "react-native";
import { Category } from "@/models/Category";
import { useMemo } from "react";

export interface CategoryListProps {
  data: ArrayLike<Category>;
  renderItem: ListRenderItem<Category>;
}

export const CategoryList = (props: CategoryListProps) => {
  const categoriesQuery = useCategories();

  const categories = useMemo(() => {
    return categoriesQuery.data?.data;
  }, [categoriesQuery.data]);

  return (
    <FlatList
      style={{ flex: 1 }}
      ListFooterComponent={
        <EndOfListWithLoading
          isLoading={categoriesQuery.isPending}
          endOfList={categoriesQuery.data && categoriesQuery.data.meta.page === categoriesQuery.data.meta.pages}
          endOfListText="Não há mais categorias"
        />
      }
      contentContainerClassName="p-4"
      data={props.data || categories}
      renderItem={props.renderItem}
      ItemSeparatorComponent={() => <View className="h-4" />}
    />
  );
};
