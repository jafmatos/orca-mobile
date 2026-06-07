import { EntryDetailBottomSheet } from "@/components/entries/EntryDetailBottomSheet";
import { EntryFormOverlay, EntryFormOverlayRef } from "@/components/entries/EntryFormOverlay";
import { EntryList } from "@/components/entries/EntryList";
import { EntryListItem } from "@/components/entries/EntryListItem";
import { EntrySearchOverlay, EntrySearchOverlayRef } from "@/components/entries/EntrySearchOverlay";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { AppConfirmationDialog } from "@/components/ui/AppConfirmationDialog";
import { AppFabOverlay } from "@/components/ui/AppFabOverlay";
import { AppHideableCurrencyText } from "@/components/ui/AppHideableCurrencyText";
import { AppSkeleton } from "@/components/ui/AppSkeleton";
import { Conditional } from "@/components/utils/Conditional";
import { useEntries } from "@/hooks/queries/use-entries";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppToast } from "@/hooks/use-app-toast";
import { Entry, EntryTypes } from "@/models/Entry";
import { PaginatedData } from "@/models/PaginatedData";
import { DeleteEntryReturnType, EntryService } from "@/services/Api/EntryApiService";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { QueryKeys } from "@/utils/QueryKeys";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { BottomSheetRef } from "jam-bottomsheet";
import React, { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { Button, FAB, IconButton, Text } from "react-native-paper";

export default function EntriesScreen() {
  const toast = useAppToast();
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const entriesQuery = useEntries();

  const [selectedEntry, setSelectedEntry] = useState<Entry>();
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [wasQueryResetted, setWasQueryResetted] = useState(false);

  const detailBottomSheetRef = React.useRef<BottomSheetRef>(null);
  const entryFormOverlayRef = React.useRef<EntryFormOverlayRef>(null);
  const entrySearchOverlayRef = React.useRef<EntrySearchOverlayRef>(null);

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

  const openEntrySearchOverlay = useCallback(() => {
    entrySearchOverlayRef.current?.open();
  }, []);

  const openEntryForm = () => entryFormOverlayRef.current?.open();
  const closeEntryForm = () => entryFormOverlayRef.current?.close();

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
    onSuccess: (data, variables) => {
      toast.success({
        title: "Lançamento removido!",
        description: "Atualize a lista para ver as modificações.",
      });

      queryClient.setQueryData(QueryKeys.Entry.getEntries(), (oldData: InfiniteData<PaginatedData<Entry>> | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({ ...page, data: page.data.filter((entry) => entry.id !== variables.id) })),
        };
      });

      queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getKpis() });

      queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getExpenseByCategory() });

      queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getMonthlyEvolution() });

      queryClient.invalidateQueries({
        predicate: (query) => QueryKeys.Entry.getEntriesFiltered(query.queryKey),
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

  const entries = useMemo(() => {
    return entriesQuery.data?.pages.flatMap((page) => page.data) || [];
  }, [entriesQuery.data]);

  return (
    <TabbedLayout>
      <Navigation
        SubHeaderComponent={
          <View style={{ height: 56 }}>
            <View className="px-4 flex flex-row items-center justify-between gap-2">
              <Text variant="headlineSmall" style={{ fontWeight: "700" }}>
                Extrato
              </Text>

              <Button
                icon="magnify"
                mode="contained"
                theme={{
                  colors: {
                    primary: theme.colors.backdrop,
                    onPrimary: theme.colors.onBackground,
                    onSurfaceVariant: theme.colors.surfaceDisabled,
                  },
                }}
                onPress={openEntrySearchOverlay}
              >
                Pesquisar
              </Button>
            </View>
          </View>
        }
      />

      <EntryList
        data={entries}
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

          queryClient.setQueryData(QueryKeys.Entry.getEntries(), (oldData: InfiniteData<PaginatedData<Entry>> | undefined) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: [
                {
                  ...oldData.pages[0],
                  data: [entry, ...oldData.pages[0].data.filter((e) => e.id !== entry.id)],
                },
                ...oldData.pages.slice(1).map((page) => ({ ...page, data: page.data.filter((e) => e.id !== entry.id) })),
              ],
            };
          });

          queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getKpis() });

          queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getExpenseByCategory() });

          queryClient.invalidateQueries({
            predicate: (query) => QueryKeys.Entry.getEntriesFiltered(query.queryKey),
          });

          closeEntryForm();
          setNeedsRefresh(true);
        }}
      />

      <EntrySearchOverlay
        ref={entrySearchOverlayRef}
        onEntryPress={(entry) => {
          setSelectedEntry(entry);
          detailBottomSheetRef.current?.open();
        }}
      />

      <EntryDetailBottomSheet
        ref={detailBottomSheetRef}
        entry={selectedEntry}
        onCloseAnimationFinished={() => setSelectedEntry(undefined)}
        onDuplicate={(entry) => {
          entryFormOverlayRef.current?.form.setForm({
            id: undefined,
            type: entry.type,
            category: { id: entry.category?.id || "" },
            amount: entry.amount,
            description: entry.description,
            when: new Date(entry.when),
          });

          openEntryForm();
        }}
        onEdit={(entry) => {
          entryFormOverlayRef.current?.form.setForm({
            id: entry.id,
            type: entry.type,
            category: { id: entry.category?.id || "" },
            amount: entry.amount,
            description: entry.description,
            when: new Date(entry.when),
          });

          openEntryForm();
        }}
        onDelete={async (entry) => {
          await entryDeleteMutation.mutateAsync(entry);
        }}
      />
    </TabbedLayout>
  );
}
