import { EntryDetailBottomSheet } from "@/components/entries/EntryDetailBottomSheet";
import { EntryList } from "@/components/entries/EntryList";
import { EntryListItem } from "@/components/entries/EntryListItem";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { AppFabOverlay } from "@/components/ui/AppFabOverlay";
import { AppConditional } from "@/components/utils/AppConditional";
import { AppLayoutConstants } from "@/constants/layout";
import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { useAppRouter } from "@/hooks/use-app-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppToast } from "@/hooks/use-app-toast";
import { Entry } from "@/models/Entry";
import { CursorPaginatedData } from "@/models/PaginatedData";
import { DeleteEntryReturnType, EntryService } from "@/services/Api/EntryApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { BottomSheetRef } from "jam-bottomsheet";
import React, { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { Button, FAB, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EntriesScreen() {
  const toast = useAppToast();
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const toastOffset =
    insets.top + AppLayoutConstants.headerHeight + AppLayoutConstants.subHeaderHeight + AppLayoutConstants.toastBaseOffset;

  const [selectedEntry, setSelectedEntry] = useState<Entry>();
  const [needsRefresh, setNeedsRefresh] = useState(false);

  const detailBottomSheetRef = React.useRef<BottomSheetRef>(null);
  const router = useAppRouter();

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

  const authUserQuery = useAuthUser();

  const authUser = useMemo(() => {
    return authUserQuery.data?.user;
  }, [authUserQuery.data]);

  const hasActiveSubscription = useMemo(() => {
    return !!authUser?.subscription?.isActive;
  }, [authUser]);

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
                onPress={() => router.goToEntrySearch()}
              >
                Pesquisar
              </Button>
            </View>
          </View>
        }
      />

      <EntryList renderItem={renderItem} onRefresh={() => setNeedsRefresh(false)} />

      <AppFabOverlay>
        <AppConditional if={needsRefresh} _then={<FAB icon="refresh" size="medium" variant="secondary" onPress={refreshList} />} />
        <AppConditional
          if={hasActiveSubscription}
          _then={<FAB icon="microphone-outline" size="medium" variant="tertiary" onPress={() => router.goToEntrySmartForm()} />}
        />
        <FAB icon="plus" size="large" onPress={() => router.goToEntryManualForm()} />
      </AppFabOverlay>

      <EntryDetailBottomSheet
        ref={detailBottomSheetRef}
        entry={selectedEntry}
        onCloseAnimationFinished={() => setSelectedEntry(undefined)}
        onDuplicate={(entry) => {
          router.push(`/(modals)/entry-manual-form?duplicateFromId=${entry.id}`);
        }}
        onEdit={(entry) => {
          router.goToEntryManualForm(entry.id);
        }}
        onDelete={async (entry) => {
          await entryDeleteMutation.mutateAsync(entry);
        }}
      />
    </TabbedLayout>
  );
}
