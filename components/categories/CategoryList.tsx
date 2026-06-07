import { useCategories } from "@/hooks/queries/use-categories";
import { Category } from "@/models/Category";
import { useMemo } from "react";
import { ListRenderItem, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { EndOfListWithLoading } from "../EndOfListWithLoading";

export interface CategoryListProps {
  data: ArrayLike<Category>;
  ListHeaderComponent?: React.ReactElement;
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
      ListHeaderComponent={props.ListHeaderComponent}
      ListFooterComponent={
        <View className="px-4">
          <EndOfListWithLoading
            isLoading={categoriesQuery.isPending}
            isOnEnd={categoriesQuery.data && categoriesQuery.data.meta.page === categoriesQuery.data.meta.pages}
            isEmpty={categoriesQuery.data?.data.length === 0}
            endOfListText="Não há mais categorias"
            emptyListText="Não há categorias"
          />
        </View>
      }
      contentContainerClassName="py-4"
      data={props.data || categories}
      renderItem={props.renderItem}
      ItemSeparatorComponent={() => <View className="h-4" />}
    />
  );
};
