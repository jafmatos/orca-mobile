import { EndOfListWithLoading } from "@/components/EndOfListWithLoading";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { SubNavigation } from "@/components/SubNavigation";
import { AppConfirmationDialog, AppConfirmationDialogRef } from "@/components/ui/AppConfirmationDialog";
import { AppCurrencyInput } from "@/components/ui/AppCurrencyInput";
import { AppFabOverlay } from "@/components/ui/AppFabOverlay";
import { AppFullScreenOverlay, AppFullScreenOverlayHeader, AppFullScreenOverlayRef } from "@/components/ui/AppFullScreenOverlay";
import { FormField } from "@/components/ui/FormField";
import { Conditional } from "@/components/utils/Conditional";
import { useCategories } from "@/hooks/queries/use-categories";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppToast } from "@/hooks/use-app-toast";
import { Category, CategoryTypes } from "@/models/Category";
import { CategoryService, CreateCategoryBody, CreateCategoryReturnType, UpdateCategoryBody } from "@/services/CategoryService";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { QueryKeys } from "@/utils/QueryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { Button, FAB, HelperText, Icon, IconButton, Menu, SegmentedButtons, Surface, Text, TextInput } from "react-native-paper";

interface CategoryForm {
  id?: Category["id"];
  name: string;
  type: CategoryTypes;
  limit?: {
    amount: number;
  } | null;
}

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

function CategoryCard(props: CategoryCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useAppTheme();

  return (
    <Surface
      className={`relative py-1 pl-4 rounded-lg flex flex-row items-center justify-between gap-0 border-l-[6px]`}
      style={{
        borderRadius: theme.roundness,
        borderLeftColor: props.category.type === CategoryTypes.Income ? theme.colors.success : theme.colors.error,
      }}
    >
      <View className="grow flex" style={{ flexShrink: 1 }}>
        <Text variant="titleMedium" ellipsizeMode="tail" numberOfLines={1}>
          {props.category.name}
        </Text>
      </View>

      <Conditional
        if={!!props.category.limit}
        _then={() => {
          return <Text className="ml-4" variant="bodySmall">{currencyFormatter.format(props.category.limit?.amount || 0)}</Text>;
        }}
      />

      <Menu
        style={{ transform: [{ translateX: -7 }, { translateY: 56 }] }}
        anchor={<IconButton icon="dots-vertical" onPress={() => setIsMenuOpen(true)} />}
        anchorPosition="top"
        visible={isMenuOpen}
        onDismiss={() => setIsMenuOpen(false)}
      >
        <Menu.Item
          title="Editar"
          leadingIcon="pencil"
          onPress={() => {
            setIsMenuOpen(false);

            props.onEdit(props.category);
          }}
        />
        <Menu.Item
          title="Remover"
          leadingIcon={({ size }) => {
            return <Icon source="trash-can" size={size} color={theme.colors.error} />;
          }}
          titleStyle={{ color: theme.colors.error }}
          onPress={() => {
            setIsMenuOpen(false);

            props.onDelete(props.category);
          }}
        />
      </Menu>
    </Surface>
  );
}

export default function CategoriesScreen() {
  const theme = useAppTheme();
  const toast = useAppToast();
  const queryClient = useQueryClient();
  const { data, isPending } = useCategories();
  const [type, setType] = useState<CategoryTypes>(CategoryTypes.Expense);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const categoryFormRef = useRef<AppFullScreenOverlayRef>(null);
  const categoryDeleteDialogref = useRef<AppConfirmationDialogRef>(null);

  const refreshList = useCallback(() => {
    queryClient.resetQueries({
      queryKey: QueryKeys.Category.getCategories(),
      exact: true,
    });
  }, [queryClient]);

  const openCategoryForm = () => categoryFormRef.current?.open();
  const closeCategoryForm = () => categoryFormRef.current?.close();
  const openDeleteDialog = () => categoryDeleteDialogref.current?.open();
  const closeDeleteDialog = () => categoryDeleteDialogref.current?.close();

  const categoryForm = useAppForm<CategoryForm>({
    name: "",
    type: CategoryTypes.Expense,
    limit: undefined,
  });
  const { mutation: categoryCreateOrUpdateMutation } = useAppFormWithMutation<
    CategoryForm,
    CreateCategoryBody & UpdateCategoryBody,
    CreateCategoryReturnType | CreateCategoryReturnType
  >(categoryForm, {
    mutationFn: (body) => {
      if (categoryForm.values.id) return CategoryService.update(categoryForm.values.id!, body);
      else return CategoryService.create(body);
    },
    onSuccess: () => {
      categoryForm.clear();

      if (categoryForm.values.id) {
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
    },
  });

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

  const categories = data?.data.filter((category) => category.type === type) || [];

  const MemoizedListHeader = useMemo(() => {
    return (
      <SubNavigation>
        <SubNavigation.Item isActive={type === CategoryTypes.Expense} label="Despesa" onPress={() => setType(CategoryTypes.Expense)} />
        <SubNavigation.Item isActive={type === CategoryTypes.Income} label="Receita" onPress={() => setType(CategoryTypes.Income)} />
      </SubNavigation>
    );
  }, [type]);

  return (
    <TabbedLayout>
      <AppFabOverlay>
        <FAB icon="plus" customSize={80} onPress={openCategoryForm} />
      </AppFabOverlay>

      <AppConfirmationDialog
        ref={categoryDeleteDialogref}
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

      <FlatList
        ListHeaderComponent={MemoizedListHeader}
        ListFooterComponent={
          <EndOfListWithLoading
            isLoading={isPending}
            endOfList={data && data.meta.page === data.meta.pages}
            endOfListText="Não há mais categorias"
          />
        }
        ListHeaderComponentClassName=""
        ListHeaderComponentStyle={{
          margin: -16,
          marginBottom: 16,
        }}
        contentContainerClassName="p-4"
        data={categories}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            onEdit={(category) => {
              categoryForm.setForm({
                id: category.id,
                name: category.name,
                type: category.type,
                limit: category.limit ? { amount: category.limit.amount } : undefined,
              });

              openCategoryForm();
            }}
            onDelete={(category) => {
              setSelectedCategory(category);
              openDeleteDialog();
            }}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
      />

      <AppFullScreenOverlay ref={categoryFormRef}>
        <AppFullScreenOverlayHeader title={categoryForm.values.id ? "Editar categoria" : "Nova categoria"} onBack={closeCategoryForm} />

        <View className="p-4 flex flex-col gap-2">
          <FormField className="mb-6">
            <SegmentedButtons
              value={categoryForm.values.type}
              onValueChange={(type) => {
                categoryForm.setForm({
                  ...categoryForm.values,
                  type,
                  limit: type === CategoryTypes.Income ? undefined : categoryForm.values.limit,
                });
              }}
              buttons={[
                {
                  label: "Despesa",
                  value: CategoryTypes.Expense,
                },
                {
                  label: "Receita",
                  value: CategoryTypes.Income,
                },
              ]}
              theme={{
                colors: {
                  secondaryContainer: theme.colors.surfaceVariant,
                  onSecondaryContainer: theme.colors.onSurfaceVariant,
                },
              }}
            />
          </FormField>

          <FormField>
            <TextInput
              mode="outlined"
              label="Nome*"
              placeholder="Nome da categoria"
              value={categoryForm.values.name}
              onChangeText={categoryForm.makeSetter("name")}
              right={
                <TextInput.Affix
                  textStyle={{
                    color: categoryForm.values.name.length > 40 ? theme.colors.error : theme.colors.onBackground,
                  }}
                  text={`${categoryForm.values.name.length}/40`}
                />
              }
            />

            <HelperText type="error" visible={categoryForm.hasError("name")}>
              {categoryForm.getError("name")}
            </HelperText>
          </FormField>

          <FormField>
            <AppCurrencyInput
              mode="outlined"
              label="Limite"
              placeholder="Limite"
              value={categoryForm.values.limit?.amount}
              onChange={(value) => categoryForm.setValue("limit", value ? { amount: value } : undefined)}
              disabled={categoryForm.values.type === CategoryTypes.Income}
            />

            <HelperText type="error" visible={categoryForm.hasError("limit")}>
              {categoryForm.getError("limit")}
            </HelperText>
          </FormField>

          <Button
            mode="contained"
            onPress={() => categoryCreateOrUpdateMutation.mutateAsync(categoryForm.values)}
            loading={categoryCreateOrUpdateMutation.isPending}
            disabled={categoryCreateOrUpdateMutation.isPending || categoryForm.hasErrors}
          >
            Pronto
          </Button>
        </View>
      </AppFullScreenOverlay>
    </TabbedLayout>
  );
}
