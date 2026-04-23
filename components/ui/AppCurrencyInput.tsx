import { currencyFormatter } from "@/utils/currencyFormatter";
import React from "react";
import AppFormattedInput from "./AppFormattedInput";

export interface AppCurrencyInputProps extends Omit<
  React.ComponentProps<typeof AppFormattedInput<number>>,
  "format" | "transform" | "defaultValue"
> {
  defaultValue?: number;
}

export function AppCurrencyInput(props: AppCurrencyInputProps) {
  const handleOnChangeText = (text: string) => {
    const sanitizedText = text.replace(/\D/g, "");
    const valueInCents = parseInt(sanitizedText);
    const valueInBRL = valueInCents / 100;

    return valueInBRL;
  };

  return (
    <AppFormattedInput<number>
      {...props}
      maxLength={28}
      value={props.value}
      onChange={(value) => props.onChange?.(value)}
      format={(value) => {
        return currencyFormatter.format(value);
      }}
      transform={(text) => (text ? handleOnChangeText(text) : 0)}
    />
  );
}
