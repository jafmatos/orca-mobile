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
    queryClient.invalidateQueries({ queryKey: QueryKeys.Category.getCategories() });
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
        onSuccess={(category, mode) => {
          if (mode === "editing") {
            toast.success({
              title: "Categoria editada!",
              description: "A lista foi atualizada com sucesso.",
            });
          } else {
            toast.success({
              title: "Categoria cadastrada!",
              description: "A lista foi atualizada com sucesso.",
            });
          }

          queryClient.setQueryData<any>(QueryKeys.Category.getCategories(), (oldData: any) => {
            if (!oldData) return oldData;

            if (mode === "editing") {
              return {
                ...oldData,
                data: oldData.data.map((c: Category) => (c.id === category.id ? category : c)),
              };
            } else {
              return {
                ...oldData,
                data: [...oldData.data, category],
              };
            }
          });

          queryClient.invalidateQueries({ queryKey: [QueryKeys.Overview.getKpis()[0]] });
          queryClient.invalidateQueries({ queryKey: QueryKeys.Category.getCategories() });
          closeCategoryForm();
        }}
      />
    </TabbedLayout>
  );
}
