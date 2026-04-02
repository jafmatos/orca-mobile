import { useCategories } from "@/hooks/queries/use-categories";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { useAppToast } from "@/hooks/use-app-toast";
import { Entry, EntryTypes } from "@/models/Entry";
import { ButtonText } from "@gluestack-ui/themed";
import { Portal } from "@gorhom/portal";
import React, { useState } from "react";
import { View } from "react-native";
import { CreateEntryBody, CreateEntryReturnType, EntryService, UpdateEntryBody, UpdateEntryReturnType } from "../services/EntryService";
import { AppFormField } from "./AppFormField";
import { AppCurrencyInput } from "./ui/AppCurrencyInput";
import { AppDatePicker } from "./ui/AppDatePicker";
import { AppSelect } from "./ui/AppSelect";
import { AppToggleSelect } from "./ui/AppToggleSelect";
import { ButtonWithLoading } from "./ui/ButtonWithLoading";
import { AppFullScreenOverlay } from "./ui/AppFullScreenOverlay";
import { PaginatedData } from "@/models/PaginatedData";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQueryClient } from "@tanstack/react-query";

type TriggerProps = {
  open?: () => void;
};

interface Form {
  id?: Entry["id"];
  type: EntryTypes;
  category: {
    id: string;
  };
  amount: number;
  description: string;
  when: Date;
}

export interface EntryFormBottomSheetProps {
  update?: Form;
  initialValues?: Form;
  trigger: (props: TriggerProps) => React.JSX.Element;
}

export function EntryFormFullScreenOverlay(props: EntryFormBottomSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const Trigger = props.trigger;

  const open = () => setIsOpen(true);

  const close = () => setIsOpen(false);

  const toast = useAppToast();
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();
  const form = useAppForm<Form>(
    props.initialValues ||
      props.update || {
        type: EntryTypes.Expense,
        category: {
          id: "",
        },
        amount: 0,
        description: "",
        when: new Date(),
      },
  );
  const { values, hasErrors, hasError, getError, makeSetter, setValue, mutation } = useAppFormWithMutation<
    Form,
    CreateEntryBody & UpdateEntryBody,
    CreateEntryReturnType | UpdateEntryReturnType
  >(form, {
    mutationFn: (body) => {
      if (form.values.id) return EntryService.update(form.values.id, body);
      else return EntryService.create(body);
    },
    onSuccess: (data) => {
      form.clear();

      if (form.values.id) {
        toast.success({
          title: "Lançamento editado!",
          description: "Atualize a lista para ver as modificações.",
        });
      } else {
        toast.success({
          title: "Lançamento cadastrado!",
          description: "Atualize a lista para ver as modificações.",
        });
      }

      queryClient.setQueryData(QueryKeys.Entry.getEntries(), (oldData: { pageParams: number[]; pages: PaginatedData<Entry>[] }) => {
        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              data: [data.entry, ...oldData.pages[0].data.filter((item) => data.entry.id !== item.id)],
            },
            ...oldData.pages.slice(1).map((page) => {
              return {
                ...page,
                data: page.data.filter((item) => data.entry.id !== item.id),
              };
            }),
          ],
        };
      });

      close();
    },
  });

  return (
    <>
      <Trigger open={open} />
      <Portal hostName="fullscreen-overlay">
        <AppFullScreenOverlay isOpen={isOpen} onClose={close}>
          <AppFullScreenOverlay.Header title={props.update ? "Editar lançamento" : "Novo lançamento"} onBack={close} />
          <View className="p-4 flex flex-col gap-2">
            <AppToggleSelect<EntryTypes>
              value={values.type}
              options={[
                {
                  label: "Despesa",
                  value: EntryTypes.Expense,
                },
                {
                  label: "Receita",
                  value: EntryTypes.Income,
                },
              ]}
              onChange={makeSetter("type")}
            />
            <AppFormField>
              <AppFormField.Label>Categoria</AppFormField.Label>
              <AppSelect
                value={values.category.id}
                onChange={(id) => setValue("category", { id })}
                closeOnSelect
                options={
                  categories?.data
                    .filter((category) => category.type === (values.type as string))
                    .map((category) => {
                      return {
                        label: category.name,
                        value: category.id,
                      };
                    }) || []
                }
              />
            </AppFormField>
            <AppFormField isRequired isInvalid={hasError("amount")}>
              <AppFormField.Label>Valor</AppFormField.Label>
              <AppCurrencyInput value={values.amount} placeholder="R$ 7,90" onChange={makeSetter("amount")} />
              <AppFormField.Error error={getError("amount")} />
            </AppFormField>
            <AppFormField isInvalid={hasError("description")}>
              <AppFormField.Label>Descrição</AppFormField.Label>
              <AppFormField.TextInput value={values.description} placeholder="Descrição" onChangeText={makeSetter("description")} />
              <AppFormField.Error error={getError("description")} />
              <AppFormField.HelperText
                text={`${values.description.length}/60`}
                color={values.description.length > 60 ? "$danger500" : undefined}
              />
            </AppFormField>
            <View className="flex flex-row columns-2 gap-4">
              <AppFormField className="grow basis-0" isRequired isInvalid={hasError("when")}>
                <AppFormField.Label>Data</AppFormField.Label>
                <AppDatePicker
                  value={values.when}
                  onChange={(value) => {
                    const when = new Date(values.when);

                    when.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());

                    setValue("when", when);
                  }}
                />
                <AppFormField.Error error={getError("when")} />
              </AppFormField>
              {/* <AppFormField className="grow basis-0" isInvalid={hasError("when")}>
										<AppFormField.Label>Horário</AppFormField.Label>
										<AppTimePicker
											value={values.when}
											onChange={(value) => {
												const when = new Date(values.when);
					
												when.setHours(value.getHours(), value.getMinutes(), 0, 0);
					
												setValue("when", when);
											}}
										/>
										<AppFormField.Error error={getError("when")} />
									</AppFormField> */}
            </View>
            <ButtonWithLoading
              mt="$6"
              onPress={() => mutation.mutateAsync(form.values)}
              isLoading={mutation.isPending}
              isDisabled={mutation.isPending || hasErrors}
              spinnerColor="$primary500"
              action="primary"
            >
              <ButtonText color="$onPrimary">Pronto</ButtonText>
            </ButtonWithLoading>
          </View>
        </AppFullScreenOverlay>
      </Portal>
    </>
  );
}
