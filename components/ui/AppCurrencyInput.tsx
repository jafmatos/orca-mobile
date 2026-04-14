import { currencyFormatter } from "@/utils/currencyFormatter";
import React from "react";
import AppFormattedInput from "./AppFormattedInput";

export type AppCurrencyInputProps = Omit<React.ComponentProps<typeof AppFormattedInput<number>>, "format" | "transform">;

export function AppCurrencyInput(props: AppCurrencyInputProps) {
  const defaultValue = 0;

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
      value={props.value || defaultValue}
      onChange={(value) => props.onChange?.(value)}
      format={(value) => {
        return currencyFormatter.format(value || defaultValue);
      }}
      transform={(text) => (text ? handleOnChangeText(text) : 0)}
    />
  );
}
