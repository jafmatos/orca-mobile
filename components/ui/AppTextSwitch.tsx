import { useAppTheme } from "@/hooks/use-app-theme";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

export interface AppTextSwitchOption<T> {
  label: string;
  value: T;
}

export interface AppTextSwitchProps<T> extends React.ComponentProps<typeof View> {
  options: AppTextSwitchOption<T>[];
  value: T;
  onChange?: (value: T) => void;
}

export function AppTextSwitch<T = string>({ options, value, onChange, ...props }: AppTextSwitchProps<T>) {
  const theme = useAppTheme();

  return (
    <View
      {...props}
      className={`flex flex-row rounded-full ${props.className}`}
      style={[
        {
          backgroundColor: theme.colors.surfaceVariant,
          padding: 4,
          height: 44,
        },
        props.style,
      ]}
    >
      {options.map((option) => {
        return (
          <TouchableOpacity
            key={String(option.value)}
            className="flex-1 justify-center items-center rounded-full"
            style={{
              backgroundColor: value === option.value ? theme.colors.primary : "transparent",
            }}
            onPress={() => onChange?.(option.value)}
          >
            <Text
              className="font-bold transition-colors duration-300"
              style={{
                color: value === option.value ? theme.colors.onPrimary : theme.colors.onSurfaceVariant,
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
