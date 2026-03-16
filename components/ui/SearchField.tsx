import React, { useState } from "react";
import { InputField, Input, InputSlot, InputIcon } from "@gluestack-ui/themed";
import { SearchIcon } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

export interface SearchFieldProps extends React.ComponentProps<typeof InputField> {
  onSearch: (text: string) => void;
  containerProps?: React.ComponentProps<typeof Input>;
}

export function SearchField(props: SearchFieldProps) {
  const [text, setText] = useState("");

  return (
    <Input {...props.containerProps}>
      <InputField value={text} onChangeText={(text) => setText(text)} placeholder="Pesquisar..." />
      <InputSlot className="pr-3">
        <TouchableOpacity onPress={() => props.onSearch(text)}>
          <InputIcon as={SearchIcon} size="lg" />
        </TouchableOpacity>
      </InputSlot>
    </Input>
  );
}
