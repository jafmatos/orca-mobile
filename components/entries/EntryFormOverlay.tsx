import { useCategories } from "@/hooks/queries/use-categories";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Entry, EntryTypes } from "@/models/Entry";
import { CreateEntryBody, UpdateEntryBody } from "@/services/Api/EntryApiService";
import React, { useImperativeHandle, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Button, HelperText, IconButton, TextInput as PaperTextInput, SegmentedButtons } from "react-native-paper";
import { AppCurrencyInput } from "../ui/AppCurrencyInput";
import { AppDatePicker } from "../ui/AppDatePicker";
import { AppFullScreenOverlay, AppFullScreenOverlayRef } from "../ui/AppFullScreenOverlay";
import { AppSelect } from "../ui/AppSelect";
import { AppTextInput } from "../ui/AppTextInput";
import { FormField } from "../ui/FormField";

export type EntryCreateOrUpdateForm = Required<CreateEntryBody & UpdateEntryBody> & {
  id?: Entry["id"];
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
}

export type EntryFormOverlayRef = AppFullScreenOverlayRef;

export const EntryFormOverlay = React.forwardRef<EntryFormOverlayRef, EntryFormOverlayProps>(function EntryForm(
  props: EntryFormOverlayProps,
  ref,
) {
  const theme = useAppTheme();
  const categoryQuery = useCategories();
  const overlayRef = React.useRef<AppFullScreenOverlayRef>(null);

  useImperativeHandle(ref, () => {
    return {
      open: (...params: Parameters<AppFullScreenOverlayRef["open"]>) => overlayRef.current?.open(...params),
      close: (...params: Parameters<AppFullScreenOverlayRef["close"]>) => overlayRef.current?.close(...params),
    };
  });

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
    <AppFullScreenOverlay 
      ref={overlayRef} 
      title={props.title}
      HeaderRightComponent={
        props.onDelete ? (
          <IconButton icon="trash-can-outline" iconColor={theme.colors.error} onPress={props.onDelete} />
        ) : undefined
      }
    >
      <ScrollView
        contentContainerClassName="p-4 flex flex-col gap-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormField>
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
        </FormField>

        <FormField>
          <AppSelect
            mode="outlined"
            label="Categoria"
            value={props.values.category?.id}
            onChange={(id) => props.onChange("category", { id })}
            closeOnSelect
            options={categoryOptions}
          />

          {props.errors?.category && (
            <HelperText type="error" visible={true}>
              {props.errors?.category}
            </HelperText>
          )}
        </FormField>

        <View className="flex flex-row items-center gap-4">
          <FormField className="grow basis-0">
            <AppCurrencyInput
              mode="outlined"
              label="Valor"
              value={props.values.amount}
              defaultValue={0}
              onChange={(value) => props.onChange("amount", value)}
            />

            {props.errors?.amount && (
              <HelperText type="error" visible={true}>
                {props.errors?.amount}
              </HelperText>
            )}
          </FormField>

          <FormField className="grow basis-0">
            <AppDatePicker
              mode="outlined"
              label="Data"
              value={props.values.when}
              onChange={(value) => props.onChange("when", value)}
              error={!!props.errors?.when}
            />

            {props.errors?.when && (
              <HelperText type="error" visible={true}>
                {props.errors?.when}
              </HelperText>
            )}
          </FormField>
        </View>

        <FormField>
          <AppTextInput
            mode="outlined"
            label="Descrição"
            value={props.values.description}
            onChangeText={(value) => props.onChange("description", value)}
            autoCorrect={false}
            spellCheck={false}
            autoComplete="off"
            right={
              <PaperTextInput.Affix
                textStyle={{
                  color: props.values.description.length > 60 ? theme.colors.error : theme.colors.onBackground,
                }}
                text={`${props.values.description.length}/60`}
              />
            }
          />

          {props.errors?.description && (
            <HelperText type="error" visible={true}>
              {props.errors?.description}
            </HelperText>
          )}
        </FormField>

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
    </AppFullScreenOverlay>
  );
});
