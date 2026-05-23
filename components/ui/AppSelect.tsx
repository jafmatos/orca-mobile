import { useAppTheme } from "@/hooks/use-app-theme";
import { useRef } from "react";
import { Pressable, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { AppBottomSheet } from "./AppBottomSheet";
import { BottomSheetRef } from "jam-bottomsheet";

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

export function AppSelect({ value, emptyLabel = "Nenhuma das opções", closeOnSelect, options, onChange, ...props }: AppSelectProps) {
  const theme = useAppTheme();
  const textInputRef = useRef(null);
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const openBottomSheet = () => bottomSheetRef.current?.open();
  const closeBottomSheet = () => bottomSheetRef.current?.close();

  const onOpen = () => {
    (textInputRef.current as any)?.focus();

    openBottomSheet();
  };

  const onClose = () => {
    (textInputRef.current as any)?.blur();
  };

  const handleOptionPress = (option: SelectOption) => {
    onChange?.(option.value);

    closeOnSelect && closeBottomSheet();
  };

  const currentOption = options.find((option) => option.value === value);

  return (
    <>
      <Pressable onPress={onOpen}>
        <TextInput
          {...props}
          editable={false}
          value={currentOption?.label || emptyLabel}
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
      <AppBottomSheet imperative portalHostName="select" style={{ zIndex: 101 }} fullscreen expandable={false} ref={bottomSheetRef}>
        <View>
          {[{ label: emptyLabel, value: "" }, ...options].map((option) => {
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
