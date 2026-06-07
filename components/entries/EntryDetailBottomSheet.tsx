import { useAppTheme } from "@/hooks/use-app-theme";
import { Entry, EntryTypes } from "@/models/Entry";
import { currencyFormatter } from "@/utils/currencyFormatter";
import React, { forwardRef, useState } from "react";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { AppBottomSheet, AppBottomSheetRef } from "../ui/AppBottomSheet";
import { AppConfirmationDialog } from "../ui/AppConfirmationDialog";
import { AppHideableCurrencyText } from "../ui/AppHideableCurrencyText";
import { AppSkeleton } from "../ui/AppSkeleton";

export interface EntryDetailBottomSheetProps {
  entry?: Entry;
  onCloseAnimationFinished?: () => void;
  onEdit?: (entry: Entry) => void;
  onDuplicate?: (entry: Entry) => void;
  onDelete?: (entry: Entry) => Promise<void> | void;
}

export type EntryDetailBottomSheetRef = AppBottomSheetRef;

export const EntryDetailBottomSheet = forwardRef<EntryDetailBottomSheetRef, EntryDetailBottomSheetProps>(
  function EntryDetailBottomSheet({ entry, onCloseAnimationFinished, onEdit, onDuplicate, onDelete }, ref) {
    const theme = useAppTheme();
    const [isDeleting, setIsDeleting] = useState(false);

    return (
      <AppBottomSheet imperative ref={ref} onCloseAnimationFinished={onCloseAnimationFinished}>
        <View className="flex flex-col gap-4">
          <View className="flex flex-row justify-between items-center gap-4">
            <View style={{ flexShrink: 1 }}>
              {!!entry ? (
                <Text variant="titleMedium" ellipsizeMode="tail" numberOfLines={1}>
                  {entry?.category?.name || "Sem categoria"}
                </Text>
              ) : (
                <AppSkeleton height={20} width={144} />
              )}
            </View>

            <View className="flex flex-row">
              <IconButton
                disabled={!entry}
                icon="content-copy"
                iconColor={theme.colors.primary}
                onPress={() => entry && onDuplicate?.(entry)}
              />
              <IconButton
                disabled={!entry}
                icon="pencil"
                iconColor={theme.colors.primary}
                onPress={() => entry && onEdit?.(entry)}
              />
              <AppConfirmationDialog
                trigger={({ open }) => {
                  return <IconButton disabled={!entry} icon="trash-can" iconColor={theme.colors.error} onPress={open} />;
                }}
                title="Remover lançamento?"
                description="Tem certeza de que deseja remover este lançamento? Não será possível recuperá-lo."
                confirmText="Tenho certeza"
                onConfirm={async (close) => {
                  if (!entry) return;
                  try {
                    setIsDeleting(true);
                    await onDelete?.(entry);
                    close();
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                confirmButtonProps={{
                  loading: isDeleting,
                  disabled: isDeleting,
                }}
                closeOnCancel
              />
            </View>
          </View>

          {!!entry ? (
            <Text variant="bodyMedium">{entry?.description || "Sem descrição"}</Text>
          ) : (
            <View className="flex gap-2">
              <AppSkeleton height={20} />
              <AppSkeleton height={20} />
            </View>
          )}

          <View className="flex flex-row justify-between items-center">
            {!!entry ? (
              <AppHideableCurrencyText
                variant="bodyMedium"
                style={{
                  color: entry?.type === EntryTypes.Expense ? theme.colors.error : theme.colors.success,
                }}
              >
                {currencyFormatter.format(entry?.amount || 0)}
              </AppHideableCurrencyText>
            ) : (
              <AppSkeleton height={20} width={80} />
            )}

            {!!entry ? (
              <Text>
                {new Date(entry!.when).toLocaleString("pt-BR", {
                  day: "numeric",
                  month: "short",
                })}
              </Text>
            ) : (
              <AppSkeleton height={20} width={80} />
            )}
          </View>
        </View>
      </AppBottomSheet>
    );
  },
);
