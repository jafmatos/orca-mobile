import { CategoryCard } from "@/components/CategoryCard";
import { EndOfListWithLoading } from "@/components/EndOfListWithLoading";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { SubNavigation } from "@/components/SubNavigation";
import { useCategories } from "@/hooks/queries/use-categories";
import { CategoryTypes } from "@/models/Category";
import { View } from "@gluestack-ui/themed";
import { useState } from "react";
import { FlatList } from "react-native";

export default function CategoriesScreen() {
  const { data, isPending } = useCategories();
  const [type, setType] = useState<CategoryTypes>(CategoryTypes.Expense);
  const categories = data?.data.filter((category) => category.type === type) || [];

  return (
    <TabbedLayout>
      <SubNavigation>
        <SubNavigation.Item isActive={type === CategoryTypes.Expense} label="Despesa" onPress={() => setType(CategoryTypes.Expense)} />
        <SubNavigation.Item isActive={type === CategoryTypes.Income} label="Receita" onPress={() => setType(CategoryTypes.Income)} />
      </SubNavigation>
      <FlatList
        ListFooterComponent={
          <EndOfListWithLoading
            isLoading={isPending}
            endOfList={data && data.meta.page === data.meta.pages}
            endOfListText="Não há mais categorias"
          />
        }
        contentContainerClassName="p-4"
        data={categories}
        renderItem={({ item }) => <CategoryCard category={item} />}
        ItemSeparatorComponent={() => <View className="h-4" />}
      />
    </TabbedLayout>
  );
}
