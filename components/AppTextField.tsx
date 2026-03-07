import { Text, TextInput, TextInputProps, View } from "react-native";

export function AppTextField({ errorMessage, ...inputProps }: TextInputProps & { errorMessage?: string }) {
  return (
    <View>
      <TextInput {...inputProps} />
      {errorMessage && <Text>{errorMessage}</Text>}
    </View>
  );
}
