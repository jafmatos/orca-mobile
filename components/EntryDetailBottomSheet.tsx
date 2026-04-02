import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { Entry, EntryTypes } from "@/models/Entry";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { Text } from "@gluestack-ui/themed";
import { CopyIcon, EditIcon, TrashIcon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { EntryFormFullScreenOverlay } from "./EntryFormFullScreenOverlay";
import { AppBottomSheet } from "./ui/AppBottomSheet";
import { AppDialog } from "./ui/AppDialog";
import { AppIconButton } from "./ui/AppIconButton";
import { AppConfirmationDialog } from "./ui/AppConfirmationDialog";
import { useMutation } from "@tanstack/react-query";
import { DeleteEntryReturnType, EntryService } from "@/services/EntryService";

type EntryDetailBottomSheetProps = {
  entry?: Entry;
  isOpen?: boolean;
  close: () => void;
};

export function EntryDetailBottomSheet(props: EntryDetailBottomSheetProps) {
  const themeColors = useAppThemeColors();
  const {} = useMutation({
    mutationFn: () => EntryService.delete(props.entry!.id),
  });

  // TODO: ellipsize the category :/
  return (
    <AppBottomSheet expandable isOpen={!!props.isOpen} onClose={props.close}>
      {props.entry ? (
        <View className="flex flex-col gap-4">
          <View className="flex flex-row justify-between items-center gap-4">
            <Text fontWeight={600} fontSize={18} color="$typography0" ellipsizeMode="tail" numberOfLines={1}>
              {props.entry.category?.name || "Sem categoria"}
            </Text>
            <View className="flex flex-row gap-2">
              <EntryFormFullScreenOverlay
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
              />
              <EntryFormFullScreenOverlay
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
              />
              <AppConfirmationDialog
                trigger={({ open }) => {
                  return <AppIconButton onPress={open} as={TrashIcon} color={themeColors["--color-danger-500"]} />;
                }}
                title="Remover lançamento?"
                description="Tem certeza de que deseja remover este lançamento? Não será possível recuperá-lo."
                confirmText="Tenho certeza"
                onConfirm={() => console.log("confirmado")}
              />
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
  );
}
