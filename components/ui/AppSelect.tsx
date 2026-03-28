import { useAppThemeName } from "@/hooks/use-app-theme-name";
import { Input, InputField, InputIcon, InputSlot, Text } from "@gluestack-ui/themed";
import { Portal } from "@gorhom/portal";
import { ChevronDownIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { AppBottomSheet } from "./AppBottomSheet";

export interface SelectOption {
  label: string;
  value: string;
}

export interface AppSelectProps {
	value: SelectOption["value"]
  emptyOption?: SelectOption;
  closeOnSelect?: boolean;
  items: SelectOption[];
  onChange?: (value: string) => void;
}

export interface AppSelectOptionProps {
  option: SelectOption;
  italic?: boolean;
  selected?: boolean;
  onPress?: (option: SelectOption) => void;
}

export function AppSelectOption(props: AppSelectOptionProps) {
  const themeName = useAppThemeName();
  const selectedBackgroundColor = themeName === "dark" ? "#ffffff15" : "#00000015";

  return (
    <Pressable
      onPress={() => props.onPress?.(props.option)}
      className="rounded-lg w-full py-4 px-6"
      style={{
        backgroundColor: props.selected ? selectedBackgroundColor : "transparent",
      }}
    >
      <Text italic={props.italic}>{props.option.label}</Text>
    </Pressable>
  );
}

export function AppSelect(props: AppSelectProps) {
  const [option, setOption] = useState<SelectOption | undefined>(props.emptyOption);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const isEmpty = option?.value === props.emptyOption?.value;

  const openBottomSheet = () => setIsBottomSheetOpen(true);

  const closeBottomSheet = () => setIsBottomSheetOpen(false);

  const handleOptionPress = (option: SelectOption) => {
    setOption(option);

    props.onChange?.(option.value);
    props.closeOnSelect && setTimeout(closeBottomSheet, 150);
  };

  return (
    <>
      <Input>
        <Pressable className="grow" onPress={openBottomSheet}>
          <InputField
            style={{
              fontStyle: isEmpty ? "italic" : "normal",
            }}
            editable={false}
            value={option?.label || "Nenhuma das opções"}
          />
        </Pressable>
        <InputSlot mr="$3">
          <InputIcon as={ChevronDownIcon} />
        </InputSlot>
      </Input>
      <Portal hostName="bottomsheet">
        <AppBottomSheet fullscreen expandable={false} isOpen={isBottomSheetOpen} onClose={closeBottomSheet}>
          <View>
            {props.emptyOption && (
              <AppSelectOption
                key={props.emptyOption.value}
                onPress={handleOptionPress}
                option={props.emptyOption}
                selected={isEmpty}
                italic
              />
            )}
            {props.items.map((item) => {
              return <AppSelectOption key={item.value} onPress={handleOptionPress} option={item} selected={option?.value === item.value} />;
            })}
          </View>
        </AppBottomSheet>
      </Portal>
    </>
  );
}
