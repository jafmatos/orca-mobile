import { EntryDetailBottomSheet } from "@/components/entries/EntryDetailBottomSheet";
import { EntryManualFormOverlay, EntryManualFormOverlayRef } from "@/components/entries/EntryManualFormOverlay";
import { EntryList } from "@/components/entries/EntryList";
import { EntryListItem } from "@/components/entries/EntryListItem";
import { EntrySearchOverlay, EntrySearchOverlayRef } from "@/components/entries/EntrySearchOverlay";
import { EntrySmartFormOverlay, EntrySmartFormOverlayRef } from "@/components/entries/EntrySmartFormOverlay";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { AppFabOverlay } from "@/components/ui/AppFabOverlay";
import { Conditional } from "@/components/utils/Conditional";
import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppToast } from "@/hooks/use-app-toast";
import { Entry } from "@/models/Entry";
import { DeleteEntryReturnType, EntryService } from "@/services/Api/EntryApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { BottomSheetRef } from "jam-bottomsheet";
import { CursorPaginatedData } from "@/models/PaginatedData";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppLayoutConstants } from "@/constants/layout";
import { Button, FAB, Text } from "react-native-paper";

export default function EntriesScreen() {
  const toast = useAppToast();
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const toastOffset =
    insets.top + AppLayoutConstants.headerHeight + AppLayoutConstants.subHeaderHeight + AppLayoutConstants.toastBaseOffset;
  const user = useAuthUser();
  const hasActiveSubscription = !!user?.subscription && ["active", "trialing"].includes(user.subscription.status);

  const [selectedEntry, setSelectedEntry] = useState<Entry>();
  const [needsRefresh, setNeedsRefresh] = useState(false);

  const detailBottomSheetRef = React.useRef<BottomSheetRef>(null);
  const entryFormOverlayRef = React.useRef<EntryManualFormOverlayRef>(null);
  const entrySearchOverlayRef = React.useRef<EntrySearchOverlayRef>(null);
  const smartEntryOverlayRef = React.useRef<EntrySmartFormOverlayRef>(null);

  const openEntryDetail = useCallback((entry: Entry) => {
    detailBottomSheetRef.current?.open({
      onFinished: () => {
        setSelectedEntry(entry);
      },
    });
  }, []);

  const closeEntryDetail = useCallback(() => {
    detailBottomSheetRef.current?.close({
      onFinished: () => {
        setSelectedEntry(undefined);
      },
    });
  }, []);

  const openEntrySearchOverlay = useCallback(() => {
    entrySearchOverlayRef.current?.open();
  }, []);

  const openEntryForm = () => entryFormOverlayRef.current?.open();
  const closeEntryForm = () => entryFormOverlayRef.current?.close();

  const openSmartEntryForm = () => smartEntryOverlayRef.current?.open();
  const closeSmartEntryForm = () => smartEntryOverlayRef.current?.close();

  const refreshList = useCallback(() => {
    setNeedsRefresh(false);

    queryClient.resetQueries({
      queryKey: QueryKeys.Entry.getEntries(),
      exact: true,
    });
  }, [queryClient]);

  const entryDeleteMutation = useMutation<DeleteEntryReturnType, Error, Entry>({
    mutationFn: (entry) => EntryService.delete(entry.id),
    onError: (error) => {
      toast.error({
        title: "Ops...",
        description: error.message || "Erro desconhecido",
        topOffset: toastOffset,
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getKpis() });

      queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getExpenseByCategory() });

      queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getMonthlyEvolution() });

      queryClient.setQueriesData<InfiniteData<CursorPaginatedData<Entry>>>(
        { queryKey: QueryKeys.Entry.getEntries(), exact: false },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.filter((e) => e.id !== variables.id),
            })),
          };
        },
      );

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
      <Navigation
        SubHeaderComponent={
          <View style={{ height: AppLayoutConstants.subHeaderHeight }}>
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

      <EntryList renderItem={renderItem} onRefresh={() => setNeedsRefresh(false)} />

      <AppFabOverlay>
        <Conditional if={needsRefresh} _then={<FAB icon="refresh" size="medium" variant="secondary" onPress={refreshList} />} />
        <Conditional if={hasActiveSubscription} _then={<FAB icon="microphone" size="medium" variant="tertiary" onPress={() => openSmartEntryForm()} />} />
        <FAB icon="plus" size="large" onPress={() => openEntryForm()} />
      </AppFabOverlay>

      <EntryManualFormOverlay
        ref={entryFormOverlayRef}
        onSuccess={(entry, mode) => {
          if (mode === "editing") {
            setSelectedEntry(entry);
          }

          queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getKpis() });

          queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getExpenseByCategory() });

          queryClient.setQueriesData<InfiniteData<CursorPaginatedData<Entry>>>(
            { queryKey: QueryKeys.Entry.getEntries(), exact: false },
            (oldData) => {
              if (!oldData) return oldData;

              const newPages = oldData.pages.map((page) => ({ ...page, data: [...page.data] }));

              if (mode === "editing") {
                for (let i = 0; i < newPages.length; i++) {
                  newPages[i].data = newPages[i].data.filter((e) => e.id !== entry.id);
                }
              }

              newPages[0].data.unshift(entry);

              if (mode === "creating") {
                const lastPageIndex = newPages.length - 1;
                newPages[lastPageIndex].data.pop();
              }

              return { ...oldData, pages: newPages };
            },
          );

          closeEntryForm();
          setNeedsRefresh(true);
        }}
      />

      <EntrySmartFormOverlay
        ref={smartEntryOverlayRef}
        onSuccess={(entries) => {
          queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getMonthlyEvolution() });
          queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getKpis() });

          queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getExpenseByCategory() });

          queryClient.setQueriesData<InfiniteData<CursorPaginatedData<Entry>>>(
            { queryKey: QueryKeys.Entry.getEntries(), exact: false },
            (oldData) => {
              if (!oldData) return oldData;

              const newPages = oldData.pages.map((page) => ({ ...page, data: [...page.data] }));

              newPages[0].data.unshift(...entries);

              const lastPageIndex = newPages.length - 1;
              newPages[lastPageIndex].data.splice(-entries.length);

              return { ...oldData, pages: newPages };
            },
          );

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
