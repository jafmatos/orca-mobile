import { useState } from "react";
import { Keyboard, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppThemeName } from "@/hooks/use-app-theme-name";
import { TextInput } from "react-native-paper";

export interface AppDatePickerProps extends Omit<React.ComponentProps<typeof TextInput>, "value" | "onChange"> {
  value: Date;
  onChange?: (date: Date) => void;
  containerClassName?: React.ComponentProps<typeof Pressable>["className"];
}

export function AppDatePicker({ value, onChange, ...props }: AppDatePickerProps) {
  const themeName = useAppThemeName();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const openPicker = () => {
    Keyboard.dismiss();
    setIsPickerOpen(true);
  };

  const closePicker = () => setIsPickerOpen(false);

  const formattedValue = value.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <>
      <Pressable onPress={openPicker} className={props.containerClassName}>
        <TextInput
          {...props}
          editable={false}
          style={[{ pointerEvents: "box-none" }, props.style]}
          value={formattedValue}
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
            if (selectedDate) onChange?.(selectedDate);
            closePicker();
          }}
          onDismiss={() => closePicker()}
        />
      )}
    </>
  );
}
