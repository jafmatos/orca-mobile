import { useAppThemeName } from "@/hooks/use-app-theme-name";
import { Input, InputField, InputIcon, InputSlot, Text } from "@gluestack-ui/themed";
import { ChevronDownIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { AppBottomSheet } from "./AppBottomSheet";

export interface SelectOption {
  label: string;
  value: string;
}

export interface AppSelectProps {
  value: SelectOption["value"];
  emptyLabel?: string;
  closeOnSelect?: boolean;
  options: SelectOption[];
  onChange?: (value: string) => void;
}

export function AppSelect(props: AppSelectProps) {
  const themeName = useAppThemeName();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const openBottomSheet = () => setIsBottomSheetOpen(true);

  const closeBottomSheet = () => setIsBottomSheetOpen(false);

  const handleOptionPress = (option: SelectOption) => {
    props.onChange?.(option.value);
    props.closeOnSelect && closeBottomSheet();
  };

  const currentOption = props.options.find((option) => option.value === props.value);
  const emptyLabel = props.emptyLabel || "Nenhuma das opções";
  const selectedOptionBackgroundColor = themeName === "dark" ? "#ffffff15" : "#00000015";

  return (
    <>
      <Input>
        <Pressable className="grow" onPress={openBottomSheet}>
          <InputField
            style={{
              fontStyle: !currentOption?.value ? "italic" : "normal",
            }}
            editable={false}
            value={currentOption?.label || emptyLabel}
          />
        </Pressable>
        <InputSlot mr="$3">
          <InputIcon as={ChevronDownIcon} />
        </InputSlot>
      </Input>
      <AppBottomSheet portalHostName="select" fullscreen expandable={false} isOpen={isBottomSheetOpen} onClose={closeBottomSheet}>
        <View>
          {[{ label: emptyLabel, value: "" }, ...props.options].map((option) => {
            return (
              <Pressable
                key={option.value}
                onPress={() => handleOptionPress(option)}
                className="rounded-lg w-full py-4 px-6"
                style={{
                  backgroundColor: option.value === currentOption?.value ? selectedOptionBackgroundColor : "transparent",
                }}
              >
                <Text italic={!option.value}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </AppBottomSheet>
    </>
  );
}
