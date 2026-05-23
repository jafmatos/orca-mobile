import { currencyFormatter } from "@/utils/currencyFormatter";
import React, { useEffect } from "react";
import { TextInput } from "react-native-paper";

export interface AppCurrencyInputProps extends Omit<React.ComponentProps<typeof TextInput>, "value" | "defaultValue" | "onChange"> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

export function AppCurrencyInput({ value, defaultValue, onChange, ...props }: AppCurrencyInputProps) {
  const [_value, _setValue] = React.useState(value || defaultValue);

  useEffect(() => {
    _setValue(value);
  }, [value]);

  return (
    <TextInput
      {...props}
      value={_value !== undefined ? currencyFormatter.format(_value) : ""}
      onChangeText={(text) => {
        const sanitizedText = text.replace(/\D/g, "");
        const valueInCents = parseInt(sanitizedText);

        if (!isNaN(valueInCents)) {
          const newValue = valueInCents / 100;

          _setValue(newValue);
          onChange?.(newValue);
        }
      }}
      mode="outlined"
      maxLength={23}
      keyboardType="numeric"
    />
  );
}
