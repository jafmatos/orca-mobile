import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { useAppThemeName } from "@/hooks/use-app-theme-name";
import { Text } from "@gluestack-ui/themed";
import { Pressable, View } from "react-native";

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export interface AppToggleSelectProps<T = string> {
  value: SelectOption["value"];
  options: SelectOption<T>[];
  onChange?: (value: T) => void;
}

export function AppToggleSelect<T>(props: AppToggleSelectProps<T>) {
  const themeName = useAppThemeName();
  const themeColors = useAppThemeColors();
  const selectedOptionBackgroundColor = themeName === "dark" ? "#ffffff15" : "#00000015";

  const handleOptionPress = (option: SelectOption<T>) => {
    props.onChange?.(option.value);
  };

  return (
    <View className="border-[1px] border-solid border-outline-700 rounded-md flex flex-row">
      {props.options.map((option, index, array) => {
        const isActive = option.value === props.value;

        return (
          <Pressable
            key={String(option.value)}
            className={` flex justify-center items-center h-12 grow ${!index ? "rounded-l-md" : ""} ${index === array.length - 1 ? "rounded-r-md" : ""}`}
            onPress={() => handleOptionPress(option)}
            style={{
              backgroundColor: isActive ? selectedOptionBackgroundColor : "transparent",
            }}
          >
            <Text size="md" color="$typography0">
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
