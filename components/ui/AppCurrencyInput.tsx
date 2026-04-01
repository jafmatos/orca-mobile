import { Input, InputField } from "@gluestack-ui/themed";
import React from "react";

export interface AppCurrencyInputProps extends Omit<React.ComponentProps<typeof InputField>, "value" | "onChange"> {
  value: number;
  onChange?: (value: number) => void;
  containerProps?: React.ComponentProps<typeof Input>;
}

export function AppCurrencyInput({ value, onChange, containerProps, ...props }: AppCurrencyInputProps) {
  const formattedValue = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);

  const handleOnChangeText = (text: string) => {
    const sanitizedText = text.replace(/\D/g, "");
    const valueInCents = parseInt(sanitizedText);
    const valueInBRL = valueInCents / 100;

    onChange?.(valueInBRL || 0);
  };

  return (
    <Input {...containerProps}>
      <InputField {...props} value={formattedValue} onChangeText={handleOnChangeText} maxLength={28} />
    </Input>
  );
}
