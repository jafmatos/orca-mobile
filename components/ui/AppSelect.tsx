import { useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { AppBottomSheet } from "./AppBottomSheet";
import { Text, TextInput } from "react-native-paper";
import { useAppTheme } from "@/hooks/useAppTheme";

export interface SelectOption {
  label: string;
  value: string;
}

export interface AppSelectProps extends Omit<React.ComponentProps<typeof TextInput>, "value" | "onChange"> {
  value: SelectOption["value"];
  emptyLabel?: string;
  closeOnSelect?: boolean;
  options: SelectOption[];
  onChange?: (value: string) => void;
}

export function AppSelect({ value, emptyLabel, closeOnSelect, options, onChange, ...props }: AppSelectProps) {
  const theme = useAppTheme();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const textInputRef = useRef(null);

  const onOpen = () => {
    (textInputRef.current as any)?.focus();

    setIsBottomSheetOpen(true);
  };

  const onClose = () => {
    (textInputRef.current as any)?.blur();

    setIsBottomSheetOpen(false);
  };

  const handleOptionPress = (option: SelectOption) => {
    onChange?.(option.value);
    closeOnSelect && onClose();
  };

  const currentOption = options.find((option) => option.value === value);
  const zemptyLabel = emptyLabel || "Nenhuma das opções";

  return (
    <>
      <Pressable onPress={onOpen}>
        <TextInput
          {...props}
          editable={false}
          value={currentOption?.label || zemptyLabel}
          style={{ pointerEvents: "box-none", fontStyle: "italic" }}
          right={<TextInput.Icon icon="chevron-down" onPress={onOpen} />}
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
      <AppBottomSheet
        portalHostName="select"
        fullscreen
        expandable={false}
        isOpen={isBottomSheetOpen}
        onClose={onClose}
        style={{ zIndex: 101 }}
      >
        <View>
          {[{ label: zemptyLabel, value: "" }, ...options].map((option) => {
            return (
              <Pressable
                key={option.value}
                onPress={() => handleOptionPress(option)}
                className="rounded-lg w-full py-4 px-6"
                style={{
                  backgroundColor: option.value === currentOption?.value ? theme.colors.surfaceVariant : "transparent",
                }}
              >
                <Text variant="bodyLarge" style={{ fontStyle: !option.value ? "italic" : "normal" }}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </AppBottomSheet>
    </>
  );
}
