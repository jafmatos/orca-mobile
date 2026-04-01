import { Portal } from "@gorhom/portal";
import { AppBottomSheet } from "./ui/AppBottomSheet";
import React from "react";
import { Entry, EntryTypes } from "@/models/Entry";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { View } from "react-native";
import { Button, ButtonIcon, Text } from "@gluestack-ui/themed";
import { CopyIcon, EditIcon, TrashIcon } from "lucide-react-native";
import { AppIconButton } from "./ui/AppIconButton";
import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { EntryFormBottomSheet } from "./EntryFormBottomSheet";

type EntryDetailBottomSheetProps = {
  entry?: Entry;
  isOpen?: boolean;
  close: () => void;
};

export function EntryDetailBottomSheet(props: EntryDetailBottomSheetProps) {
  const themeColors = useAppThemeColors();

  // TODO: ellipsize the category :/
  return (
    <Portal hostName="bottomsheet">
      <AppBottomSheet expandable isOpen={!!props.isOpen} onClose={props.close}>
        {props.entry ? (
          <View className="flex flex-col gap-4">
            <View className="flex flex-row justify-between items-center gap-4">
              <Text fontWeight={600} fontSize={18} color="$typography0" ellipsizeMode="tail" numberOfLines={1}>
                {props.entry.category?.name || "Sem categoria"}
              </Text>
              <View className="flex flex-row gap-2">
                <EntryFormBottomSheet
                  initialValues={{
                    type: props.entry.type,
                    category: {
                      id: props.entry.category.id,
                    },
                    amount: props.entry.amount,
                    description: props.entry.description,
                    when: new Date(props.entry.when),
                  }}
                  trigger={({ open }) => {
                    return <AppIconButton onPress={open} as={CopyIcon} color={themeColors["--color-info-500"]} />;
                  }}
                  onSuccess={props.close}
                />
                <EntryFormBottomSheet
                  update={{
                    id: props.entry.id,
                    type: props.entry.type,
                    category: {
                      id: props.entry.category.id,
                    },
                    amount: props.entry.amount,
                    description: props.entry.description,
                    when: new Date(props.entry.when),
                  }}
                  trigger={({ open }) => {
                    return <AppIconButton onPress={open} as={EditIcon} color={themeColors["--color-warning-500"]} />;
                  }}
                  onSuccess={props.close}
                />

                <AppIconButton as={TrashIcon} color={themeColors["--color-danger-500"]} />
              </View>
            </View>

            <Text color="$typography200">{props.entry.description || "Sem descrição"}</Text>
            <View className="flex flex-row justify-between items-center">
              <Text fontWeight={500} color={props.entry.type === EntryTypes.Income ? "$success500" : "$danger500"}>
                {currencyFormatter.format(props.entry.amount)}
              </Text>
              <Text fontSize={14} fontWeight={600} color="$typography400">
                {new Date(props.entry.when).toLocaleString("pt-BR", {
                  day: "numeric",
                  month: "short",
                })}
              </Text>
            </View>
          </View>
        ) : (
          <></>
        )}
      </AppBottomSheet>
    </Portal>
  );
}
