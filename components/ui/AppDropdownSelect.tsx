import { useAppTheme } from "@/hooks/use-app-theme";
import React, { useEffect, useState } from "react";
import { Keyboard, Pressable, View } from "react-native";
import { Icon, Text, TextInput } from "react-native-paper";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export interface AppDropdownSelectOption<T extends string | number> {
  label: string;
  value: T;
}

export interface AppDropdownSelectProps<T extends string | number> extends Omit<
  React.ComponentProps<typeof TextInput>,
  "value" | "onChange"
> {
  value: T;
  emptyLabel?: string;
  closeOnSelect?: boolean;
  options: AppDropdownSelectOption<T>[];
  onChange?: (value: T) => void;
}

export function AppDropdownSelect<T extends string | number>({
  value,
  emptyLabel,
  closeOnSelect = true,
  options,
  onChange,
  ...props
}: AppDropdownSelectProps<T>) {
  const theme = useAppTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    if (props.disabled) return;

    Keyboard.dismiss();
    setIsOpen(!isOpen);
  };

  const handleOptionPress = (option: AppDropdownSelectOption<T>) => {
    onChange?.(option.value);
		
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  const currentOption = options.find((o) => o.value === value);
  const allOptions = emptyLabel ? [{ label: emptyLabel, value: "" as T }, ...options] : options;

  const ITEM_HEIGHT = 48;
  const BORDER_WIDTH = 1;
  const MARGIN_TOP = 8;
  const maxDropdownHeight = allOptions.length * ITEM_HEIGHT + BORDER_WIDTH * 2 + MARGIN_TOP;

  const heightValue = useSharedValue(0);
  const rotationValue = useSharedValue(0);

  useEffect(() => {
    heightValue.value = withTiming(isOpen ? maxDropdownHeight : 0, { duration: 250 });
    rotationValue.value = withTiming(isOpen ? 180 : 0, { duration: 250 });
  }, [isOpen, maxDropdownHeight, heightValue, rotationValue]);

  const animatedDropdownStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
    opacity: heightValue.value > 0 ? 1 : 0,
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationValue.value}deg` }],
  }));

  return (
    <View className="flex flex-col relative" style={{ zIndex: isOpen ? 50 : 1 }}>
      <Pressable onPress={toggleOpen}>
        <TextInput
          {...props}
          editable={false}
          value={currentOption?.label || emptyLabel}
          style={[{ pointerEvents: "box-none" }, props.style]}
          right={
            <TextInput.Icon
              icon={({ size, color }) => (
                <Animated.View style={animatedIconStyle}>
                  <Icon source="chevron-down" size={size} color={color} />
                </Animated.View>
              )}
              onPress={toggleOpen}
            />
          }
          theme={{
            fonts: {
              bodyMedium: {
                fontStyle: !currentOption?.value ? "italic" : "normal",
              },
              bodyLarge: {
                fontStyle: !currentOption?.value ? "italic" : "normal",
              },
            },
          }}
        />
      </Pressable>

      <Animated.View className="absolute w-full overflow-hidden" style={[animatedDropdownStyle, { top: "100%", zIndex: 100 }]}>
        <View
          className="rounded-lg border mt-2"
          style={{ borderColor: theme.colors.outlineVariant, backgroundColor: theme.colors.surface }}
        >
          {allOptions.map((option) => {
            const isSelected = option.value === value;

            return (
              <Pressable
                key={option.value}
                onPress={() => handleOptionPress(option)}
                className="w-full flex justify-center px-4"
                style={{
                  height: ITEM_HEIGHT,
                  backgroundColor: isSelected ? theme.colors.surfaceVariant : "transparent",
                }}
              >
                <Text variant="bodyLarge" style={{ fontStyle: !option.value ? "italic" : "normal" }}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}
