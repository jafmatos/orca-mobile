import { TextInput, TextInputProps } from "react-native-paper";
import { AppText } from "./ui/AppText";
import { View } from "react-native";

// TODO: theme the danger color for error message

export function AppTextField({ errorMessage, ...textInputProps }: TextInputProps & { errorMessage?: string }) {
  return (
    <View>
      <TextInput {...textInputProps} />
      {errorMessage && <AppText className="text-red-500">{errorMessage}</AppText>}
    </View>
  );
}
