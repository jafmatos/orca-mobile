import { EntryFormOverlay, EntryFormOverlayRef } from "@/components/entries/EntryFormOverlay";
import { EntryList } from "@/components/entries/EntryList";
import { EntryListItem } from "@/components/entries/EntryListItem";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { AppConfirmationDialog } from "@/components/ui/AppConfirmationDialog";
import { AppFabOverlay } from "@/components/ui/AppFabOverlay";
import { AppSkeleton } from "@/components/ui/AppSkeleton";
import { Conditional } from "@/components/utils/Conditional";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppToast } from "@/hooks/use-app-toast";
import { Entry, EntryTypes } from "@/models/Entry";
import { PaginatedData } from "@/models/PaginatedData";
import { DeleteEntryReturnType, EntryService } from "@/services/EntryService";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { QueryKeys } from "@/utils/QueryKeys";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { BottomSheetRef } from "jam-bottomsheet";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { FAB, IconButton, Text } from "react-native-paper";

export default function EntriesScreen() {
  const [selectedEntry, setSelectedEntry] = useState<Entry>();
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [wasQueryResetted, setWasQueryResetted] = useState(false);

  const detailBottomSheetRef = React.useRef<BottomSheetRef>(null);
  const entryFormOverlayRef = React.useRef<EntryFormOverlayRef>(null);

  const openEntryDetail = useCallback((entry: Entry) => {
    detailBottomSheetRef.current?.open({
      onFinished: () => {
        setSelectedEntry(entry);
      },
    });
  }, []);

  const closeEntryDetail = useCallback(() => {
    detailBottomSheetRef.current?.close({
      onFinished: () => setSelectedEntry(undefined),
    });
  }, []);

  const openEntryForm = () => entryFormOverlayRef.current?.open();
  const closeEntryForm = () => entryFormOverlayRef.current?.close();

  const toast = useAppToast();
  const theme = useAppTheme();

  const queryClient = useQueryClient();

  const refreshList = useCallback(() => {
    setWasQueryResetted(true);

    setTimeout(() => {
      queryClient.resetQueries({
        queryKey: QueryKeys.Entry.getEntries(),
        exact: true,
      });
    }, 0);
  }, [queryClient]);

  const entryDeleteMutation = useMutation<DeleteEntryReturnType, Error, Entry>({
    mutationFn: (entry) => EntryService.delete(entry.id),
    onError: (error) => {
      toast.error({
        title: "Ops...",
        description: error.message || "Erro desconhecido",
      });
    },
    onSuccess: () => {
      toast.success({
        title: "Lançamento removido!",
        description: "Atualize a lista para ver as modificações.",
      });

      queryClient.setQueryData(QueryKeys.Entry.getEntries(), (oldData: InfiniteData<PaginatedData<Entry>>) => {
        return oldData;
        // return {
        //   ...oldData,
        //   pages: oldData.pages.map((page) => ({ ...page, data: page.data.filter((entry) => entry.id !== selectedEntry?.id) })),
        // };
      });

      setSelectedEntry(undefined);
      closeEntryDetail();
      setNeedsRefresh(true);
    },
  });

  const renderItem = useCallback(
    ({ item }: { item: Entry }) => {
      return <EntryListItem data={item} onPress={() => openEntryDetail(item)} />;
    },
    [openEntryDetail],
  );

  return (
    <TabbedLayout>
      <EntryList
        renderItem={renderItem}
        onRefresh={() => setWasQueryResetted(true)}
        onFetchSuccess={() => {
          if (wasQueryResetted && needsRefresh) {
            setNeedsRefresh(false);
            setWasQueryResetted(false);
          }
        }}
      />

      <AppFabOverlay>
        <Conditional if={needsRefresh} _then={<FAB icon="refresh" size="medium" variant="secondary" onPress={refreshList} />} />
        <FAB icon="plus" customSize={80} onPress={() => openEntryForm()} />
      </AppFabOverlay>

      <EntryFormOverlay
        ref={entryFormOverlayRef}
        onSuccess={(entry, mode) => {
          if (mode === "editing") {
            setSelectedEntry(entry);

            toast.success({
              title: "Lançamento editado!",
              description: "Atualize a lista para ver as modificações.",
            });
          } else {
            toast.success({
              title: "Lançamento cadastrado!",
              description: "Atualize a lista para ver as modificações.",
            });
          }

          queryClient.setQueryData(QueryKeys.Entry.getEntries(), (oldData: InfiniteData<PaginatedData<Entry>>) => {
            return {
              ...oldData,
              pages: [
                {
                  ...oldData.pages[0],
                  data: [entry, ...oldData.pages[0].data],
                },
                ...oldData.pages.slice(1).map((page) => ({ ...page, data: page.data.filter((entry) => entry.id !== entry.id) })),
              ],
            };
          });

          closeEntryForm();
          setNeedsRefresh(true);
        }}
      />

      <AppBottomSheet
        imperative
        ref={detailBottomSheetRef}
        onCloseAnimationFinished={() => {
          setSelectedEntry(undefined);
        }}
      >
        <View className="flex flex-col gap-4">
          <View className="flex flex-row justify-between items-center gap-4">
            <View style={{ flexShrink: 1 }}>
              {!!selectedEntry ? (
                <Text variant="titleMedium" ellipsizeMode="tail" numberOfLines={1}>
                  {selectedEntry?.category?.name || "Sem categoria"}
                </Text>
              ) : (
                <AppSkeleton height={20} width={144} />
              )}
            </View>

            <View className="flex flex-row">
              <IconButton
                disabled={!selectedEntry}
                icon="content-copy"
                iconColor={theme.colors.primary}
                onPress={() => {
                  if (!selectedEntry) return;

                  entryFormOverlayRef.current?.form.setForm({
                    id: undefined,
                    type: selectedEntry.type,
                    category: {
                      id: selectedEntry.category?.id || "",
                    },
                    amount: selectedEntry.amount,
                    description: selectedEntry.description,
                    when: new Date(selectedEntry.when),
                  });

                  openEntryForm();
                }}
              />
              <IconButton
                disabled={!selectedEntry}
                icon="pencil"
                iconColor={theme.colors.primary}
                onPress={() => {
                  if (!selectedEntry) return;

                  entryFormOverlayRef.current?.form.setForm({
                    id: selectedEntry.id,
                    type: selectedEntry.type,
                    category: {
                      id: selectedEntry.category?.id || "",
                    },
                    amount: selectedEntry.amount,
                    description: selectedEntry.description,
                    when: new Date(selectedEntry.when),
                  });

                  openEntryForm();
                }}
              />
              <AppConfirmationDialog
                trigger={({ open }) => {
                  return <IconButton disabled={!selectedEntry} icon="trash-can" iconColor={theme.colors.error} onPress={open} />;
                }}
                title="Remover lançamento?"
                description="Tem certeza de que deseja remover este lançamento? Não será possível recuperá-lo."
                confirmText="Tenho certeza"
                onConfirm={async (close) => {
                  await entryDeleteMutation.mutateAsync(selectedEntry!);

                  close();
                }}
                confirmButtonProps={{
                  loading: entryDeleteMutation.isPending,
                  disabled: entryDeleteMutation.isPending,
                }}
                closeOnCancel
              />
            </View>
          </View>

          {!!selectedEntry ? (
            <Text variant="bodyMedium">{selectedEntry?.description || "Sem descrição"}</Text>
          ) : (
            <View className="flex gap-2">
              <AppSkeleton height={20} />
              <AppSkeleton height={20} />
            </View>
          )}

          <View className="flex flex-row justify-between items-center">
            {!!selectedEntry ? (
              <Text
                variant="bodyMedium"
                style={{
                  color: selectedEntry?.type === EntryTypes.Expense ? theme.colors.error : theme.colors.success,
                }}
              >
                {currencyFormatter.format(selectedEntry?.amount || 0)}
              </Text>
            ) : (
              <AppSkeleton height={20} width={80} />
            )}

            {!!selectedEntry ? (
              <Text>
                {new Date(selectedEntry!.when).toLocaleString("pt-BR", {
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
    </TabbedLayout>
  );
}
