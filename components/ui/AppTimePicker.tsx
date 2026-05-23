import { useState } from "react";
import { Keyboard, Pressable, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppThemeName } from "@/hooks/use-app-theme-name";
import { TextInput } from "react-native-paper";

export interface AppTimePickerProps extends Omit<React.ComponentProps<typeof TextInput>, "value" | "onChange"> {
  value: Date;
  onChange?: (date: Date) => void;
  containerClassName?: React.ComponentProps<typeof Pressable>["className"];
}

export function AppTimePicker({ value, onChange, ...props }: AppTimePickerProps) {
  const themeName = useAppThemeName();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const openPicker = () => {
    Keyboard.dismiss();
    setIsPickerOpen(true);
  };

  const closePicker = () => setIsPickerOpen(false);

  const formattedValue = value.toLocaleString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
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
        <View style={{ backgroundColor: "red" }}>
          <DateTimePicker
            style={{ backgroundColor: "transparent" }}
            locale="pt-BR"
            themeVariant={themeName}
            value={value}
            mode={"time"}
            display="spinner"
            is24Hour={true}
            onValueChange={(_event, selectedDate) => {
              if (selectedDate) onChange?.(selectedDate);
              closePicker();
            }}
            onDismiss={() => closePicker()}
          />
        </View>
      )}
    </>
  );
}
