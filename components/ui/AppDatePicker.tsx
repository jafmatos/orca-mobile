import { useState } from "react";
import { Pressable, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppThemeName } from "@/hooks/use-app-theme-name";
import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { TextInput } from "react-native-paper";
import AppFormattedInput from "./AppFormattedInput";

export interface AppDatePickerProps extends Omit<React.ComponentProps<typeof TextInput>, "value" | "onChange"> {
  value: Date;
  emptyLabel?: string;
  onChange?: (date: Date) => void;
}

export function AppDatePicker({ value, emptyLabel, onChange, ...props }: AppDatePickerProps) {
  const themeName = useAppThemeName();
  const themeColors = useAppThemeColors();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const openPicker = () => setIsPickerOpen(true);

  const closePicker = () => setIsPickerOpen(false);

  return (
    <>
      <Pressable onPress={openPicker}>
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
            console.log(text);
            return new Date();
          }}
        />
      </Pressable>
      {isPickerOpen && (
        <View style={{ backgroundColor: "red" }}>
          <DateTimePicker
            style={{ backgroundColor: "transparent" }}
            locale="pt-BR"
            accentColor={themeColors["--color-secondary-500"]}
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
        </View>
      )}
    </>
  );
}
