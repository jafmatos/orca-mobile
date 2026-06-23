import { currencyFormatter } from "@/utils/currencyFormatter";
import React, { useEffect } from "react";
import { TextInput } from "react-native-paper";

export interface AppCurrencyInputProps extends Omit<React.ComponentProps<typeof TextInput>, "value" | "defaultValue" | "onChange"> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

export function AppCurrencyInput({ value, defaultValue, onChange, onFocus, onBlur, ...props }: AppCurrencyInputProps) {
  const [_value, _setValue] = React.useState(value || defaultValue);
  const isFocused = React.useRef(false);

  useEffect(() => {
    if (!isFocused.current || value === 0 || value === undefined) {
      _setValue(value);
    }
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
      onFocus={(e) => {
        isFocused.current = true;
        if (onFocus) onFocus(e as any);
      }}
      onBlur={(e) => {
        isFocused.current = false;
        if (onBlur) onBlur(e as any);
      }}
      mode="outlined"
      maxLength={23}
      keyboardType="numeric"
    />
  );
}
