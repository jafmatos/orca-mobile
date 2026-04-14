import { TextInput } from "react-native-paper";

export interface AppFormattedInputProps<T> extends Omit<React.ComponentProps<typeof TextInput>, "value" | "onChange"> {
  value: T;
  onChange: (value: T) => void;
  format: (value: T) => string;
  transform: (text: string) => T;
}

export default function AppFormattedInput<T>({ value, onChange, format, transform, ...props }: AppFormattedInputProps<T>) {
  return <TextInput {...props} value={format(value)} onChangeText={(text) => onChange(transform(text))} />;
}
