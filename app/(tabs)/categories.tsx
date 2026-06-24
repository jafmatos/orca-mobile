import { Navigation } from "@/components/Navigation";
import { CategoryFormOverlay, CategoryFormOverlayRef } from "@/components/categories/CategoryFormOverlay";
import { CategoryList } from "@/components/categories/CategoryList";
import { CategoryListItem } from "@/components/categories/CategoryListItem";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { AppConfirmationDialog, AppConfirmationDialogRef } from "@/components/ui/AppConfirmationDialog";
import { AppFabOverlay } from "@/components/ui/AppFabOverlay";
import { AppSegmentedControl } from "@/components/ui/AppSegmentedControl";
import { useCategories } from "@/hooks/queries/use-categories";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppToast } from "@/hooks/use-app-toast";
import { Category, CategoryTypes } from "@/models/Category";
import { CategoryService } from "@/services/Api/CategoryApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppLayoutConstants } from "@/constants/layout";
import { FAB } from "react-native-paper";

export default function CategoriesScreen() {
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const toast = useAppToast();
  const insets = useSafeAreaInsets();
  const toastOffset =
    insets.top + AppLayoutConstants.headerHeight + AppLayoutConstants.subHeaderHeight + AppLayoutConstants.toastBaseOffset;
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedType, setSelectedType] = useState<CategoryTypes | undefined>(undefined);
  const categoryDeleteDialogRef = useRef<AppConfirmationDialogRef>(null);
  const categoryFormRef = useRef<CategoryFormOverlayRef>(null);

  const openCategoryForm = () => categoryFormRef.current?.open();
  const closeCategoryForm = () => categoryFormRef.current?.close();
  const openDeleteDialog = () => categoryDeleteDialogRef.current?.open();
  const closeDeleteDialog = () => categoryDeleteDialogRef.current?.close();

  const refreshList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: QueryKeys.Category.getCategories() });
  }, [queryClient]);

  const deleteCategoryMutation = useMutation({
    mutationFn: (category: Category) => CategoryService.delete(category.id),
    onError: (error) => {
      toast.error({
        title: "Ops...",
        description: error.message || "Erro desconhecido",
        topOffset: toastOffset,
      });
    },
    onSuccess: () => {
      refreshList();
      queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getKpis() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getExpenseByCategory() });
    },
  });

  const categoriesQuery = useCategories();

  const categories = useMemo(() => {
    const filtered = categoriesQuery.data?.data.filter((category) => category.type === selectedType || !selectedType) || [];

    return filtered.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === CategoryTypes.Expense ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });
  }, [categoriesQuery.data, selectedType]);

  const renderItem = useCallback(({ item }: { item: Category }) => {
    return (
      <View className="px-4">
        <CategoryListItem
          data={item}
          onPressEdit={(category) => {
            categoryFormRef.current?.form.setForm({
              id: category.id,
              name: category.name,
              type: category.type,
              limit: category.limit ? { id: category.limit.id, amount: category.limit.amount } : null,
            });

            openCategoryForm();
          }}
          onPressDelete={(category) => {
            setSelectedCategory(category);
            openDeleteDialog();
          }}
        />
      </View>
    );
  }, []);

  return (
    <TabbedLayout>
      <Navigation
        SubHeaderComponent={
          <AppSegmentedControl<CategoryTypes>
            style={{ height: AppLayoutConstants.subHeaderHeight }}
            allowUnselect
            options={[
              { label: "Despesas", value: CategoryTypes.Expense },
              { label: "Receitas", value: CategoryTypes.Income },
            ]}
            value={selectedType}
            onChange={setSelectedType}
          />
        }
      />

      <CategoryList renderItem={renderItem} data={categories} />

      <AppFabOverlay>
        <FAB icon="plus" size="large" onPress={openCategoryForm} />
      </AppFabOverlay>

      <AppConfirmationDialog
        ref={categoryDeleteDialogRef}
        title="Remover categoria"
        description="Tem certeza que deseja remover esta categoria? Não será possível recuperá-la depois."
        onConfirm={() => {
          closeDeleteDialog();
          setSelectedCategory(null);

          if (selectedCategory) {
            deleteCategoryMutation.mutate(selectedCategory);
          }
        }}
      />

      <CategoryFormOverlay
        ref={categoryFormRef}
        onSuccess={(category, mode) => {
          queryClient.invalidateQueries({ queryKey: [QueryKeys.Overview.getKpis()[0]] });
          refreshList();
          closeCategoryForm();
        }}
      />
    </TabbedLayout>
  );
}
