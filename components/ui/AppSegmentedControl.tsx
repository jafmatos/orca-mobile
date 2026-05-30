import React from "react";
import { View, Pressable, ViewProps } from "react-native";
import { Text } from "react-native-paper";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Conditional } from "@/components/utils/Conditional";

export interface AppSegmentedControlOption<T = string> {
  label: string;
  value: T;
}

export interface AppSegmentedControlProps<T = string> extends ViewProps {
  options: AppSegmentedControlOption<T>[];
  value?: T;
  onChange: (value: T | undefined) => void;
  allowUnselect?: boolean;
}

export function AppSegmentedControl<T = string>({
  options,
  value,
  onChange,
  allowUnselect = false,
  className,
  ...props
}: AppSegmentedControlProps<T>) {
  const theme = useAppTheme();

  const handlePress = (optionValue: T) => {
    if (allowUnselect && value === optionValue) {
      onChange(undefined);
    } else {
      onChange(optionValue);
    }
  };

  return (
    <View {...props} className={`flex flex-row ${className || ""}`}>
      {options.map((option, index) => {
        const isSelected = value === option.value;
        return (
          <Pressable
            key={index}
            onPress={() => handlePress(option.value)}
            className="relative flex-1 items-center justify-center min-h-[48px]"
          >
            <Conditional
              if={isSelected}
              _then={<View className="absolute h-1 w-full rounded-sm bottom-0" style={{ backgroundColor: theme.colors.primary }} />}
            />
            <Text 
              variant="labelLarge" 
              style={{ color: isSelected ? theme.colors.primary : theme.colors.onSurfaceVariant }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
