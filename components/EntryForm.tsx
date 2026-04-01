import { useCategories } from "@/hooks/queries/use-categories";
import { useAppForm } from "@/hooks/use-app-form";
import { Entry, EntryTypes } from "@/models/Entry";
import { View } from "react-native";
import { AppFormField } from "./AppFormField";
import { AppSelect } from "./ui/AppSelect";
import { AppToggleSelect } from "./ui/AppToggleSelect";
import { ButtonWithLoading } from "./ui/ButtonWithLoading";
import { ButtonText } from "@gluestack-ui/themed";
import { AppDatePicker } from "./ui/AppDatePicker";
import { AppTimePicker } from "./ui/AppTimePicker";
import { AppCurrencyInput } from "./ui/AppCurrencyInput";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { CreateEntryBody, CreateEntryReturnType, EntryService } from "../services/EntryService";
import { useAppToast } from "@/hooks/use-app-toast";

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

export interface EntryFormProps {
  update?: Form;
  onSuccess?: (data: CreateEntryReturnType) => void;
}

export function EntryForm(props: EntryFormProps) {
  const toast = useAppToast();
  const { data: categories } = useCategories();
  const form = useAppForm<Form>(
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
    CreateEntryBody,
    CreateEntryReturnType
  >(form, {
    mutationFn: (body) => {
      if (props.update) return EntryService.update(props.update.id!, body);
      else return EntryService.create(body);
    },
    onSuccess: (data) => {
      console.log(data);

      form.clear();

      toast.success({
        title: "Lançamento cadastrado!",
      });

      props.onSuccess?.(data);
    },
  });

  return (
    <View className="flex flex-col gap-2">
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
  );
}
