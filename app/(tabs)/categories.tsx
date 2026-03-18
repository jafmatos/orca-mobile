import { CategoryCard } from "@/components/CategoryCard";
import { EndOfListWithLoading } from "@/components/EndOfListWithLoading";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { useCategories } from "@/hooks/queries/use-categories";
import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { CategoryTypes } from "@/models/Category";
import { Pressable, Text, View } from "@gluestack-ui/themed";
import { useState } from "react";
import { FlatList } from "react-native";

const SubNavigationItem = ({
  type,
  activeType,
  label,
  ...props
}: React.ComponentProps<typeof Pressable> & { type: CategoryTypes; activeType: CategoryTypes; label: string }) => {
  return (
    <Pressable className="relative h-full grow bg-background-950" {...props}>
      <View opacity={activeType !== type ? 0.5 : 1} className="h-full flex flex-row justify-center items-center">
        {activeType === type && <View className="absolute bottom-0 w-full h-1 bg-primary-500" />}
        <Text className="text-center" fontWeight={500}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

export default function CategoriesScreen() {
  const { data, isPending } = useCategories();
  const [type, setType] = useState<CategoryTypes>(CategoryTypes.Expense);
  const categories = data?.data.filter((category) => category.type === type) || [];

  return (
    <TabbedLayout>
      <Navigation />
      <View className="h-16 flex flex-row columns-2 border-b-[1px] border-outline-900">
        <SubNavigationItem type={CategoryTypes.Expense} activeType={type} label="Despesa" onPress={() => setType(CategoryTypes.Expense)} />
        <SubNavigationItem type={CategoryTypes.Income} activeType={type} label="Receita" onPress={() => setType(CategoryTypes.Income)} />
      </View>
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
