import { View } from "react-native";
import { Chip } from "react-native-paper";

export interface SelectOption<T> {
  label: string;
  value: T;
  key?: string;
  onSelect?: () => void;
}

export interface AppChipSelectProps<T> {
  value: T;
  emptyValue?: T;
  options: SelectOption<T>[];
  onChange?: (value: T) => void;
}

export function AppChipSelect<T = string>(props: AppChipSelectProps<T>) {
  return (
    <View className="flex flex-row flex-wrap gap-2">
      {props.options.map((option) => {
        return (
          <Chip
            mode="outlined"
            key={option.key || String(option.value)}
            onPress={() => {
              option.onSelect?.();

              props.onChange?.(option.value);
            }}
            selected={props.value === option.value}
            showSelectedCheck
            showSelectedOverlay
          >
            {option.label}
          </Chip>
        );
      })}
    </View>
  );
}
