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
} from "@/services/CategoryService";
import React, { useImperativeHandle } from "react";
import { View } from "react-native";
import { Button, HelperText, SegmentedButtons, TextInput } from "react-native-paper";
import { AppCurrencyInput } from "../ui/AppCurrencyInput";
import { AppFullScreenOverlay, AppFullScreenOverlayProps, AppFullScreenOverlayRef } from "../ui/AppFullScreenOverlay";
import { FormField } from "../ui/FormField";

export type CategoryCreateOrUpdateForm = Required<CreateCategoryBody & UpdateCategoryBody> & {
  id?: Category["id"];
};

export interface CategoryFormOverlayProps extends Omit<AppFullScreenOverlayProps, "title"> {
  onSuccess?: (Category: Category, mode: "creating" | "editing") => void;
}

export interface CategoryFormOverlayRef extends AppFullScreenOverlayRef {
  form: ReturnType<typeof useAppForm<CategoryCreateOrUpdateForm>>;
}

export const CategoryFormOverlay = React.forwardRef<CategoryFormOverlayRef, CategoryFormOverlayProps>(function CategoryForm(
  props: CategoryFormOverlayProps,
  ref,
) {
  const theme = useAppTheme();
  const categoryFormRef = React.useRef<AppFullScreenOverlayRef>(null);

  useImperativeHandle(ref, () => {
    return {
      open: () => categoryFormRef.current?.open(),
      close: () => categoryFormRef.current?.close(),
      form: categoryForm,
    };
  });

  const categoryForm = useAppForm<CategoryCreateOrUpdateForm>({
    name: "",
    type: CategoryTypes.Expense,
    limit: null,
  });

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
      categoryForm.clear();

      props.onSuccess?.(data.category, categoryForm.values.id ? "editing" : "creating");
    },
  });

  return (
    <AppFullScreenOverlay
      ref={categoryFormRef}
      title={categoryForm.values.id ? "Editar categoria" : "Nova categoria"}
      onCloseAnimationFinished={() => categoryForm.clear()}
    >
      <View className="p-4 flex flex-col gap-2">
        <FormField className="mb-6">
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
            onChange={(value) => categoryForm.setValue("limit", value ? { amount: value } : null)}
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
  );
});
