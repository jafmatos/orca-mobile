import { useCategories } from "@/hooks/queries/use-categories";
import { AppForm, useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Entry, EntryTypes } from "@/models/Entry";
import { CreateEntryBody, CreateEntryReturnType, EntryService, UpdateEntryBody, UpdateEntryReturnType } from "@/services/EntryService";
import React, { useImperativeHandle, useMemo } from "react";
import { View } from "react-native";
import { Button, HelperText, SegmentedButtons, TextInput } from "react-native-paper";
import { AppCurrencyInput } from "../ui/AppCurrencyInput";
import { AppFullScreenOverlay, AppFullScreenOverlayRef } from "../ui/AppFullScreenOverlay";
import { AppSelect } from "../ui/AppSelect";
import { FormField } from "../ui/FormField";
import { AppDatePicker } from "../ui/AppDatePicker";

export type EntryCreateOrUpdateForm = Required<CreateEntryBody & UpdateEntryBody> & {
  id?: Entry["id"];
};

export interface EntryFormOverlayProps {
  onSuccess: (entry: Entry, mode: "creating" | "editing") => void;
}

export type EntryFormOverlayRef = AppFullScreenOverlayRef & {
  form: AppForm<EntryCreateOrUpdateForm>;
};

export const EntryFormOverlay = React.forwardRef<EntryFormOverlayRef, EntryFormOverlayProps>(function EntryForm(
  props: EntryFormOverlayProps,
  ref,
) {
  const theme = useAppTheme();
  const entryForm = useAppForm<EntryCreateOrUpdateForm>({
    type: EntryTypes.Expense,
    category: {
      id: "",
    },
    amount: 0,
    description: "",
    when: new Date(),
  });
  const categoryQuery = useCategories();
  const overlayRef = React.useRef<AppFullScreenOverlayRef>(null);

  const { mutation: entryCreateOrUpdateMutation } = useAppFormWithMutation<
    EntryCreateOrUpdateForm,
    CreateEntryBody & UpdateEntryBody,
    CreateEntryReturnType | UpdateEntryReturnType
  >(entryForm, {
    mutationFn: (body) => {
      if (entryForm.values.id) return EntryService.update(entryForm.values.id!, body);
      else return EntryService.create(body);
    },
    onSuccess: (data) => {
      entryForm.clear();

      props.onSuccess?.(data.entry, entryForm.values.id ? "editing" : "creating");
    },
  });

  useImperativeHandle(ref, () => {
    return {
      open: () => overlayRef.current?.open(),
      close: () => overlayRef.current?.close(),
      form: entryForm,
    };
  });

  const categoryOptions = useMemo(() => {
    return (
      categoryQuery.data?.data
        .filter((category) => category.type === (entryForm.values.type as string))
        .map((category) => {
          return {
            label: category.name,
            value: category.id,
          };
        }) || []
    );
  }, [categoryQuery.data?.data, entryForm.values.type]);

  return (
    <AppFullScreenOverlay
      ref={overlayRef}
      title={!!entryForm.values.id ? "Editar lançamento" : "Novo lançamento"}
      onCloseAnimationFinished={() => entryForm.clear()}
    >
      <View className="p-4 flex flex-col gap-2">
        <FormField className="mb-6">
          <SegmentedButtons
            value={entryForm.values.type}
            onValueChange={entryForm.makeSetter("type")}
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
        </FormField>

        <FormField>
          <AppSelect
            mode="outlined"
            label="Categoria"
            value={entryForm.values.category.id}
            onChange={(id) => entryForm.setValue("category", { id })}
            closeOnSelect
            options={categoryOptions}
          />

          <HelperText type="error" visible={entryForm.hasError("category")}>
            {entryForm.getError("category")}
          </HelperText>
        </FormField>

        <View className="flex flex-row items-center gap-4">
          <FormField className="grow basis-0">
            <AppCurrencyInput
              mode="outlined"
              label="Valor"
              value={entryForm.values.amount}
              defaultValue={0}
              onChange={entryForm.makeSetter("amount")}
              error={entryForm.hasError("amount")}
            />

            <HelperText type="error" visible={entryForm.hasError("amount")}>
              {entryForm.getError("amount")}
            </HelperText>
          </FormField>

          <FormField className="grow basis-0">
            <AppDatePicker
              mode="outlined"
              label="Data"
              value={entryForm.values.when}
              onChange={entryForm.makeSetter("when")}
              error={entryForm.hasError("when")}
            />

            <HelperText type="error" visible={entryForm.hasError("when")}>
              {entryForm.getError("when")}
            </HelperText>
          </FormField>
        </View>

        <FormField>
          <TextInput
            mode="outlined"
            label="Descrição"
            value={entryForm.values.description}
            onChangeText={entryForm.makeSetter("description")}
            right={
              <TextInput.Affix
                textStyle={{
                  color: entryForm.values.description.length > 60 ? theme.colors.error : theme.colors.onBackground,
                }}
                text={`${entryForm.values.description.length}/60`}
              />
            }
          />

          <HelperText type="error" visible={entryForm.hasError("description")}>
            {entryForm.getError("description")}
          </HelperText>
        </FormField>

        <Button
          mode="contained"
          onPress={() => entryCreateOrUpdateMutation.mutateAsync(entryForm.values)}
          loading={entryCreateOrUpdateMutation.isPending}
          disabled={entryCreateOrUpdateMutation.isPending || entryForm.hasErrors}
        >
          Pronto
        </Button>
      </View>
    </AppFullScreenOverlay>
  );
});
