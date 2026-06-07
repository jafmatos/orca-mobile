import { useAppTheme } from "@/hooks/use-app-theme";
import { useRef } from "react";
import { Keyboard, Pressable, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { AppBottomSheet } from "./AppBottomSheet";
import { BottomSheetRef } from "jam-bottomsheet";

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export interface AppSelectProps<T = string> extends Omit<React.ComponentProps<typeof TextInput>, "value" | "onChange"> {
  value: SelectOption<T>["value"];
  emptyLabel?: string;
  closeOnSelect?: boolean;
  options: SelectOption<T>[];
  onChange?: (value: T) => void;
}

export function AppSelect<T = string>({ value, emptyLabel, closeOnSelect, options, onChange, ...props }: AppSelectProps<T>) {
  const theme = useAppTheme();
  const textInputRef = useRef(null);
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const openBottomSheet = () => bottomSheetRef.current?.open();
  const closeBottomSheet = () => bottomSheetRef.current?.close();

  const onOpen = () => {
    if (props.disabled) return;

    Keyboard.dismiss();
    (textInputRef.current as any)?.focus();

    openBottomSheet();
  };

  const onClose = () => {
    (textInputRef.current as any)?.blur();
  };

  const handleOptionPress = (option: SelectOption<T>) => {
    onChange?.(option.value);

    closeOnSelect &&
      setTimeout(() => {
        closeBottomSheet();
      }, 300);
  };

  const currentOption = options.find((option) => option.value === value);

  const allOptions = emptyLabel ? [{ label: emptyLabel, value: "" }, ...options] : options;

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
          {allOptions.map((option) => {
            return (
              <Pressable
                key={String(option.value)}
                onPress={() => handleOptionPress(option as SelectOption<T>)}
                className="rounded-lg w-full py-4 px-6"
                style={{
                  backgroundColor: option.value === (value || "") ? theme.colors.surfaceVariant : "transparent",
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
