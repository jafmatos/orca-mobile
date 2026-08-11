import { AppConditional } from "@/components/utils/AppConditional";
import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { Pressable, View, ViewProps } from "react-native";
import { Icon, Text } from "react-native-paper";

export interface AppSegmentedControlOption<T = string> {
  label: string;
  value: T;
  icon?: string;
}

export interface AppSegmentedControlProps<T = string> extends ViewProps {
  options: AppSegmentedControlOption<T>[];
  value?: T;
  onChange: (value: T | undefined) => void;
  allowUnselect?: boolean;
  activeColor?: string;
  inactiveColor?: string;
}

export function AppSegmentedControl<T = string>({
  options,
  value,
  onChange,
  allowUnselect = false,
  className,
  activeColor,
  inactiveColor,
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
        const textColor = isSelected ? activeColor || theme.colors.primary : inactiveColor || theme.colors.onSurfaceVariant;

        return (
          <Pressable
            key={index}
            onPress={() => handlePress(option.value)}
            className="relative flex-1 min-h-[48px] flex flex-row gap-3 items-center justify-center"
          >
            <AppConditional
              if={isSelected}
              _then={
                <View
                  className="absolute h-1 w-full rounded-sm bottom-0"
                  style={{ backgroundColor: activeColor || theme.colors.primary }}
                />
              }
            />

            {option.icon && <Icon source={option.icon} size={16} color={textColor} />}

            <Text variant="labelLarge" style={{ color: textColor }}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
