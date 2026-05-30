import { View } from "react-native";
import { Chip } from "react-native-paper";

export interface SelectOption<T> {
  label: string;
  value: T;
  key?: string;
  onSelect?: () => void;
}

export interface AppChipSelectProps<T> extends React.ComponentProps<typeof View> {
  value: T;
  options: SelectOption<T>[];
  allowUnselect?: boolean;
  onChange?: (value: T) => void;
}

export function AppChipSelect<T = string>({ value, options, allowUnselect, onChange, ...props }: AppChipSelectProps<T>) {
  return (
    <View {...props} className={`flex flex-row flex-wrap gap-2 ${props.className}`}>
      {options.map((option, index) => {
        const isSelected = value instanceof Object ? JSON.stringify(value) === JSON.stringify(option.value) : value === option.value;

        return (
          <Chip
            compact
            mode="outlined"
            key={index}
            onPress={() => {
              if (isSelected && allowUnselect) {
                onChange?.(undefined as unknown as T);
              } else {
                option.onSelect?.();
                onChange?.(option.value);
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
