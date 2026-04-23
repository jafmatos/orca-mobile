import { TextInput } from "react-native-paper";

export interface AppFormattedInputProps<T> extends Omit<React.ComponentProps<typeof TextInput>, "value" | "defaultValue" | "onChange"> {
  value?: T;
  defaultValue?: T;
  onChange: (value: T) => void;
  format: (value: T) => string;
  transform: (text: string) => T;
}

export default function AppFormattedInput<T>({ value, defaultValue, onChange, format, transform, ...props }: AppFormattedInputProps<T>) {
  const displayValue = value !== undefined ? format(value) : defaultValue !== undefined ? format(defaultValue) : "";

  return <TextInput {...props} value={displayValue} onChangeText={(text) => onChange(transform(text))} />;
}
