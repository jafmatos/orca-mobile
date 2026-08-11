import { useCategories } from "@/hooks/queries/use-categories";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Entry, EntryTypes } from "@/models/Entry";
import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Button, HelperText, IconButton, TextInput as PaperTextInput, SegmentedButtons } from "react-native-paper";
import { FullScreenLayout } from "../layouts/FullScreenLayout";
import { AppCurrencyInput } from "../ui/AppCurrencyInput";
import { AppDatePicker } from "../ui/AppDatePicker";
import { AppFormField } from "../ui/AppFormField";
import { AppModalHeader } from "../ui/AppModalHeader";
import { AppSelect } from "../ui/AppSelect";
import { AppTextInput } from "../ui/AppTextInput";

export type EntryCreateOrUpdateForm = {
  id?: Entry["id"];
  type: EntryTypes;
  category?: { id: string };
  amount: number;
  description?: string;
  when: Date;
};

export interface EntryFormOverlayProps {
  title: string;
  values: EntryCreateOrUpdateForm;
  errors?: Partial<Record<keyof EntryCreateOrUpdateForm, string>>;
  hasErrors?: boolean;
  isSubmitting?: boolean;
  submitButtonText: string;
  onChange: <Key extends keyof EntryCreateOrUpdateForm>(key: Key, value: EntryCreateOrUpdateForm[Key]) => void;
  onSubmit: () => void;
  onDelete?: () => void;
  onBackPress?: () => void;
}

export function EntryForm(props: EntryFormOverlayProps) {
  const theme = useAppTheme();
  const categoryQuery = useCategories();

  const categoryOptions = useMemo(() => {
    return (
      categoryQuery.data?.data
        .filter((category) => category.type === (props.values.type as string))
        .map((category) => {
          return {
            label: category.name,
            value: category.id,
          };
        }) || []
    );
  }, [categoryQuery.data?.data, props.values.type]);

  return (
    <FullScreenLayout>
      <AppModalHeader
        title={props.title}
        onBackPress={props.onBackPress}
        HeaderRightComponent={
          props.onDelete ? <IconButton icon="trash-can-outline" iconColor={theme.colors.error} onPress={props.onDelete} /> : undefined
        }
      />
      <ScrollView
        contentContainerClassName="p-4 flex flex-col gap-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppFormField>
          <SegmentedButtons
            value={props.values.type}
            onValueChange={(value) => props.onChange("type", value)}
            buttons={[
              {
                label: "Despesa",
                value: EntryTypes.Expense,
              },
              {
                label: "Receita",
                value: EntryTypes.Income,
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
          <AppSelect
            mode="outlined"
            label="Categoria"
            value={props.values.category?.id}
            onChange={(id) => props.onChange("category", id ? { id } : undefined)}
            closeOnSelect
            options={categoryOptions}
          />

          {props.errors?.category && (
            <HelperText type="error" visible={true}>
              {props.errors?.category}
            </HelperText>
          )}
        </AppFormField>

        <View className="flex flex-row items-start gap-4">
          <AppFormField className="grow basis-0">
            <AppCurrencyInput
              mode="outlined"
              label="Valor *"
              value={props.values.amount}
              defaultValue={0}
              onChange={(value) => props.onChange("amount", value)}
            />

            {props.errors?.amount && (
              <HelperText type="error" visible={true}>
                {props.errors?.amount}
              </HelperText>
            )}
          </AppFormField>

          <AppFormField className="grow basis-0">
            <AppDatePicker
              mode="outlined"
              label="Data *"
              value={props.values.when || new Date()}
              onChange={(value) => props.onChange("when", value)}
              error={!!props.errors?.when}
            />

            {props.errors?.when && (
              <HelperText type="error" visible={true}>
                {props.errors?.when}
              </HelperText>
            )}
          </AppFormField>
        </View>

        <AppFormField>
          <AppTextInput
            mode="outlined"
            label="Descrição"
            value={props.values.description || ""}
            onChangeText={(value) => props.onChange("description", value)}
            autoCorrect={false}
            spellCheck={false}
            autoComplete="off"
            right={
              <PaperTextInput.Affix
                textStyle={{
                  color: (props.values.description || "").length > 60 ? theme.colors.error : theme.colors.onBackground,
                }}
                text={`${(props.values.description || "").length}/60`}
              />
            }
          />

          {props.errors?.description && (
            <HelperText type="error" visible={true}>
              {props.errors?.description}
            </HelperText>
          )}
        </AppFormField>

        <Button
          className="mt-2"
          mode="contained"
          onPress={props.onSubmit}
          loading={props.isSubmitting}
          disabled={props.isSubmitting || props.hasErrors}
        >
          {props.submitButtonText}
        </Button>
      </ScrollView>
    </FullScreenLayout>
  );
}
