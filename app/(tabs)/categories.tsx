import { useCallback, useMemo, useRef, useState } from "react";
import { FAB } from "react-native-paper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { CategoryFormOverlay, CategoryFormOverlayRef } from "@/components/categories/CategoryFormOverlay";
import { CategoryList } from "@/components/categories/CategoryList";
import { CategoryListItem } from "@/components/categories/CategoryListItem";
import { AppConfirmationDialog, AppConfirmationDialogRef } from "@/components/ui/AppConfirmationDialog";
import { AppFabOverlay } from "@/components/ui/AppFabOverlay";
import { useAppToast } from "@/hooks/use-app-toast";
import { Category, CategoryTypes } from "@/models/Category";
import { CategoryService } from "@/services/CategoryService";
import { QueryKeys } from "@/utils/QueryKeys";
import { CategoryListHeader } from "@/components/categories/CategoryListHeader";
import { useCategories } from "@/hooks/queries/use-categories";

export default function CategoriesScreen() {
  const queryClient = useQueryClient();
  const toast = useAppToast();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedType, setSelectedType] = useState<CategoryTypes | undefined>(undefined);
  const categoryDeleteDialogRef = useRef<AppConfirmationDialogRef>(null);
  const categoryFormRef = useRef<CategoryFormOverlayRef>(null);

  const openCategoryForm = () => categoryFormRef.current?.open();
  const closeCategoryForm = () => categoryFormRef.current?.close();
  const openDeleteDialog = () => categoryDeleteDialogRef.current?.open();
  const closeDeleteDialog = () => categoryDeleteDialogRef.current?.close();

  const refreshList = useCallback(() => {
    queryClient.resetQueries({
      queryKey: QueryKeys.Category.getCategories(),
      exact: true,
    });
  }, [queryClient]);

  const deleteCategoryMutation = useMutation({
    mutationFn: (category: Category) => CategoryService.delete(category.id),
    onError: (error) => {
      toast.error({
        title: "Ops...",
        description: error.message || "Erro desconhecido",
      });
    },
    onSuccess: () => {
      toast.success({
        title: "Categoria removida!",
        description: "Atualize a lista para ver as modificações.",
      });

      refreshList();
    },
  });

  const categoriesQuery = useCategories();

  const categories = useMemo(() => {
    return categoriesQuery.data?.data.filter((category) => category.type === selectedType || !selectedType) || [];
  }, [categoriesQuery.data, selectedType]);

  const renderItem = useCallback(({ item }: { item: Category }) => {
    return (
      <CategoryListItem
        data={item}
        onPressEdit={(category) => {
          categoryFormRef.current?.form.setForm({
            id: category.id,
            name: category.name,
            type: category.type,
            limit: category.limit ? { amount: category.limit.amount } : null,
          });

          openCategoryForm();
        }}
        onPressDelete={(category) => {
          setSelectedCategory(category);
          openDeleteDialog();
        }}
      />
    );
  }, []);

  return (
    <TabbedLayout>
      <Navigation SubHeaderComponent={<CategoryListHeader onFilterChange={(filter) => setSelectedType(filter.type)} />} />

      <CategoryList renderItem={renderItem} data={categories} />

      <AppFabOverlay>
        <FAB icon="plus" customSize={80} onPress={openCategoryForm} />
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
        onSuccess={(_category, mode) => {
          if (mode === "editing") {
            toast.success({
              title: "Categoria editada!",
              description: "Atualize a lista para ver as modificações.",
            });
          } else {
            toast.success({
              title: "Categoria cadastrada!",
              description: "Atualize a lista para ver as modificações.",
            });
          }

          closeCategoryForm();
          refreshList();
        }}
      />
    </TabbedLayout>
  );
}
