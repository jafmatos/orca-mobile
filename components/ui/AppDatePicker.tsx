import { useState } from "react";
import { Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppThemeName } from "@/hooks/use-app-theme-name";
import { TextInput } from "react-native-paper";
import AppFormattedInput from "./AppFormattedInput";

export interface AppDatePickerProps extends Omit<React.ComponentProps<typeof TextInput>, "value" | "defaultValue" | "onChange"> {
  value: Date;
  emptyLabel?: string;
  onChange?: (date: Date) => void;
  containerClassName?: React.ComponentProps<typeof Pressable>["className"];
}

export function AppDatePicker({ value, emptyLabel, onChange, ...props }: AppDatePickerProps) {
  const themeName = useAppThemeName();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const openPicker = () => setIsPickerOpen(true);

  const closePicker = () => setIsPickerOpen(false);

  return (
    <>
      <Pressable onPress={openPicker} className={props.containerClassName}>
        <AppFormattedInput
          {...props}
          editable={false}
          value={value}
          onChange={(date) => onChange?.(date)}
          format={(date) =>
            date.toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          }
          transform={(text) => {
            return new Date();
          }}
        />
      </Pressable>
      {isPickerOpen && (
        <DateTimePicker
          locale="pt-BR"
          themeVariant={themeName}
          value={value}
          mode={"date"}
          is24Hour={true}
          onValueChange={(_event, selectedDate) => {
            onChange?.(selectedDate);
            closePicker();
          }}
          onDismiss={() => closePicker()}
        />
      )}
    </>
  );
}
