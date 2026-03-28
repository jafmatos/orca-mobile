import { EntryTypes } from "@/models/Entry";
import { AppFormField } from "./AppFormField";
import { AppSelect } from "./ui/AppSelect";
import { View } from "react-native";

type Form = {
	type: EntryTypes
	category: string;
	amount: number;
	description: string
	when: Date
}

export function EntryForm() {
  return (
    <View>
      <AppFormField>
        <AppFormField.Label>Categoria</AppFormField.Label>
        <AppSelect
          onChange={(value) => console.log(value)}
          emptyOption={{
            value: "",
            label: "Sem categoria",
          }}
          closeOnSelect
          items={
            categories?.data.map((category) => {
              return {
                label: category.name,
                value: category.id,
              };
            }) || []
          }
        />
      </AppFormField>
      <AppFormField>
        <AppFormField.Label>Categoria</AppFormField.Label>
        <AppSelect
          onChange={(value) => console.log(value)}
          emptyOption={{
            value: "",
            label: "Sem categoria",
          }}
          closeOnSelect
          items={
            categories?.data.map((category) => {
              return {
                label: category.name,
                value: category.id,
              };
            }) || []
          }
        />
      </AppFormField>
      <AppFormField>
        <AppFormField.Label>Descrição</AppFormField.Label>
        <AppFormField.TextInput value={text} placeholder="Descrição" onChangeText={setText} />
      </AppFormField>
    </View>
  );
}
