import { Input, InputField } from "@gluestack-ui/themed";
import { useState } from "react";
import { Pressable, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppThemeName } from "@/hooks/use-app-theme-name";
import useAppThemeColors from "@/hooks/use-app-theme-colors";

export interface AppDatePickerProps {
  value: Date;
  emptyLabel?: string;
  onChange?: (date: Date) => void;
}

export function AppDatePicker(props: AppDatePickerProps) {
  const themeName = useAppThemeName();
  const themeColors = useAppThemeColors();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const openPicker = () => setIsPickerOpen(true);

  const closePicker = () => setIsPickerOpen(false);

  return (
    <>
      <Input>
        <Pressable className="grow" onPress={openPicker}>
          <InputField
            editable={false}
            value={props.value.toLocaleString("pt-BR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          />
        </Pressable>
      </Input>
      {isPickerOpen && (
        <View style={{ backgroundColor: "red" }}>
          <DateTimePicker
            style={{ backgroundColor: "transparent" }}
            locale="pt-BR"
            accentColor={themeColors["--color-secondary-500"]}
            themeVariant={themeName}
            value={props.value}
            mode={"date"}
            is24Hour={true}
            onValueChange={(_event, selectedDate) => {
              props.onChange?.(selectedDate);
              closePicker();
            }}
            onDismiss={() => closePicker()}
          />
        </View>
      )}
    </>
  );
}
