import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { AppCurrencyInput } from "@/components/ui/AppCurrencyInput";
import { AppFormField } from "@/components/ui/AppFormField";
import { AppModalHeader } from "@/components/ui/AppModalHeader";
import { AppTextInput } from "@/components/ui/AppTextInput";
import { AppKeyboardDismissing } from "@/components/utils/AppKeyboardDismissing";
import { useCategories } from "@/hooks/queries/use-categories";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Category, CategoryTypes } from "@/models/Category";
import {
  CategoryService,
  CreateCategoryBody,
  CreateCategoryReturnType,
  UpdateCategoryBody,
  UpdateCategoryReturnType,
} from "@/services/Api/CategoryApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { Button, HelperText, TextInput as PaperTextInput, SegmentedButtons } from "react-native-paper";

type CategoryCreateOrUpdateForm = Required<CreateCategoryBody & UpdateCategoryBody> & {
  id?: Category["id"];
};

export default function CategoryFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const theme = useAppTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const categoriesQuery = useCategories();

  const categoryForm = useAppForm<CategoryCreateOrUpdateForm>({
    name: "",
    type: CategoryTypes.Expense,
    limit: null,
  });

  useEffect(() => {
    if (id && categoriesQuery.data?.data) {
      const category = categoriesQuery.data.data.find((c) => c.id === id);
      if (category) {
        categoryForm.setForm({
          id: category.id,
          name: category.name,
          type: category.type,
          limit: category.limit ? { id: category.limit.id, amount: category.limit.amount } : null,
        });
      }
    }
  }, [id, categoriesQuery.data?.data]);

  const { mutation: categoryCreateOrUpdateMutation } = useAppFormWithMutation<
    CategoryCreateOrUpdateForm,
    CreateCategoryBody & UpdateCategoryBody,
    CreateCategoryReturnType | UpdateCategoryReturnType
  >(categoryForm, {
    mutationFn: (body) => {
      if (categoryForm.values.id) return CategoryService.update(categoryForm.values.id!, body);
      else return CategoryService.create(body);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.Category.getCategories() });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Overview.getKpis()[0]] });

      router.back();
    },
  });

  return (
    <FullScreenLayout>
      <AppModalHeader title={categoryForm.values.id ? "Editar categoria" : "Nova categoria"} />
      <AppKeyboardDismissing.ScrollView>
        <View className="p-4 flex flex-col gap-4">
          <AppFormField>
            <SegmentedButtons
              value={categoryForm.values.type}
              onValueChange={(type) => {
                categoryForm.setForm({
                  ...categoryForm.values,
                  type,
                  limit:
                    type === CategoryTypes.Income
                      ? null
                      : {
                          ...categoryForm.values.limit,
                          amount: categoryForm.values.limit?.amount || 0,
                        },
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
          </AppFormField>

          <AppFormField>
            <AppTextInput
              mode="outlined"
              label="Nome*"
              placeholder="Nome da categoria"
              value={categoryForm.values.name}
              onChangeText={categoryForm.makeSetter("name")}
              right={
                <PaperTextInput.Affix
                  textStyle={{
                    color: categoryForm.values.name.length > 40 ? theme.colors.error : theme.colors.onBackground,
                  }}
                  text={`${categoryForm.values.name.length}/40`}
                />
              }
            />

            {categoryForm.hasError("name") && (
              <HelperText type="error" visible={true}>
                {categoryForm.getError("name")}
              </HelperText>
            )}
          </AppFormField>

          <AppFormField>
            <AppCurrencyInput
              mode="outlined"
              label="Limite"
              placeholder="Limite"
              value={categoryForm.values.limit?.amount}
              onChange={(value) => categoryForm.setValue("limit", value ? { ...categoryForm.values.limit, amount: value } : null)}
              disabled={categoryForm.values.type === CategoryTypes.Income}
            />

            {categoryForm.hasError("limit") && (
              <HelperText type="error" visible={true}>
                {categoryForm.getError("limit")}
              </HelperText>
            )}
          </AppFormField>

          <Button
            className="mt-2"
            mode="contained"
            onPress={() => categoryCreateOrUpdateMutation.mutateAsync(categoryForm.values)}
            loading={categoryCreateOrUpdateMutation.isPending}
            disabled={categoryCreateOrUpdateMutation.isPending || categoryForm.hasErrors}
          >
            Pronto
          </Button>
        </View>
      </AppKeyboardDismissing.ScrollView>
    </FullScreenLayout>
  );
}
