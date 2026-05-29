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
  options: SelectOption<T>[];
  allowUnselect?: boolean;
  onChange?: (value: T) => void;
}

export function AppChipSelect<T = string>(props: AppChipSelectProps<T>) {
  return (
    <View className="flex flex-row flex-wrap gap-2">
      {props.options.map((option, index) => {
        const isSelected =
          props.value instanceof Object ? JSON.stringify(props.value) === JSON.stringify(option.value) : props.value === option.value;

        return (
          <Chip
            compact
            mode="outlined"
            key={index}
            onPress={() => {
              if (isSelected && props.allowUnselect) {
                props.onChange?.(undefined as unknown as T);
              } else {
                option.onSelect?.();
                props.onChange?.(option.value);
              }
            }}
            selected={isSelected}
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
