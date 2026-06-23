import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { ScheduleFormOverlay, ScheduleFormOverlayRef } from "@/components/schedules/ScheduleFormOverlay";
import { ScheduleList } from "@/components/schedules/ScheduleList";
import { ScheduleListItem } from "@/components/schedules/ScheduleListItem";
import { SchedulesCalendarView } from "@/components/schedules/SchedulesCalendarView";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { AppConfirmationDialog } from "@/components/ui/AppConfirmationDialog";
import { AppFabOverlay } from "@/components/ui/AppFabOverlay";
import { AppHideableCurrencyText } from "@/components/ui/AppHideableCurrencyText";
import { AppSkeleton } from "@/components/ui/AppSkeleton";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppToast } from "@/hooks/use-app-toast";
import { useSchedules } from "@/hooks/queries/use-schedules";
import { ApiErrorResponseData } from "@/models/ApiErrorResponseData";
import { EntryTypes } from "@/models/Entry";
import { PaginatedData } from "@/models/PaginatedData";
import { Schedule, ScheduleFrequency, ScheduleCycleStatus } from "@/models/Schedule";
import { RemoveScheduleReturnType, ScheduleService } from "@/services/Api/ScheduleApiService";
import { DeleteEntryReturnType, EntryService } from "@/services/Api/EntryApiService";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { QueryKeys } from "@/utils/QueryKeys";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { BottomSheetRef } from "jam-bottomsheet";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppLayoutConstants } from "@/constants/layout";
import { Checkbox, FAB, IconButton, Text } from "react-native-paper";
import { CreateScheduleOccurrenceReturnType, ScheduleOccurrenceService } from "@/services/Api/ScheduleOccurrenceApiService";
import { AppSegmentedControl } from "@/components/ui/AppSegmentedControl";

export default function SchedulesScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");
  const [selectedScheduleContext, setSelectedScheduleContext] = useState<{
    schedule: Schedule;
    dateStr: string;
    isDone: boolean;
    entryId?: string;
  }>();
  const selectedSchedule = selectedScheduleContext?.schedule;

  const schedulesQuery = useSchedules();
  const schedules = React.useMemo(() => schedulesQuery.data?.pages.flatMap((page) => page.data) || [], [schedulesQuery.data]);

  const detailBottomSheetRef = React.useRef<BottomSheetRef>(null);
  const scheduleFormOverlayRef = React.useRef<ScheduleFormOverlayRef>(null);

  const openScheduleDetail = useCallback((schedule: Schedule, dateStr?: string, isDone?: boolean, entryId?: string) => {
    const defaultDate = new Date();
    const defaultDateStr = `${defaultDate.getFullYear()}-${String(defaultDate.getMonth() + 1).padStart(2, "0")}-${String(defaultDate.getDate()).padStart(2, "0")}`;

    let resolvedDateStr = dateStr;
    if (!resolvedDateStr) {
      let relevantCycle = schedule.cycles?.find((c) => c.status !== ScheduleCycleStatus.Done);
      if (!relevantCycle && schedule.cycles && schedule.cycles.length > 0) {
        relevantCycle = schedule.cycles[schedule.cycles.length - 1];
      }
      if (relevantCycle?.expectedDate) {
        resolvedDateStr = relevantCycle.expectedDate.split("T")[0];
      } else {
        resolvedDateStr = defaultDateStr;
      }
    }

    const cycle = schedule.cycles?.find((c) => c.expectedDate?.split("T")[0] === resolvedDateStr);
    const resolvedIsDone = isDone ?? cycle?.status === ScheduleCycleStatus.Done;
    const resolvedEntryId = entryId ?? cycle?.occurrence?.entryId;

    detailBottomSheetRef.current?.open({
      onFinished: () =>
        setSelectedScheduleContext({ schedule, dateStr: resolvedDateStr, isDone: resolvedIsDone, entryId: resolvedEntryId }),
    });
  }, []);

  const closeScheduleDetail = useCallback(() => {
    detailBottomSheetRef.current?.close({
      onFinished: () => setSelectedScheduleContext(undefined),
    });
  }, []);

  const openScheduleForm = () => scheduleFormOverlayRef.current?.open();
  const closeScheduleForm = () => scheduleFormOverlayRef.current?.close();

  const toast = useAppToast();
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const toastOffset = insets.top + AppLayoutConstants.headerHeight + AppLayoutConstants.subHeaderHeight + AppLayoutConstants.toastBaseOffset;

  const scheduleDeleteMutation = useMutation<RemoveScheduleReturnType, Error, Schedule>({
    mutationFn: (schedule) => ScheduleService.remove(schedule.id),
    onError: (error) => {
      toast.error({
        title: "Ops...",
        description: error.message || "Erro desconhecido",
        topOffset: toastOffset,
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.Schedule.getSchedules(), refetchType: "all" });

      setSelectedScheduleContext(undefined);
      closeScheduleDetail();
    },
  });

  const createOccurrenceMutation = useMutation<CreateScheduleOccurrenceReturnType, Error, { schedule: Schedule }>({
    mutationFn: async ({ schedule }) => {
      const data = await ScheduleOccurrenceService.create(schedule.id, {
        when: new Date(),
      });

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.Schedule.getSchedules(), refetchType: "all" });

      queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.all(), refetchType: "all" });

      queryClient.invalidateQueries({ queryKey: QueryKeys.Entry.getEntries(), refetchType: "all" });

      setSelectedScheduleContext(undefined);
      closeScheduleDetail();
    },
    onError: (error: any) => {
      if (error.response?.data instanceof ApiErrorResponseData) {
        toast.error({
          title: "Ops...",
          description: error.response.data.message || "Erro desconhecido",
          topOffset: toastOffset,
        });
      }
    },
  });

  const deleteOccurrenceEntryMutation = useMutation<DeleteEntryReturnType, Error, { entryId: string }>({
    mutationFn: async ({ entryId }) => {
      const data = await EntryService.delete(entryId);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.Schedule.getSchedules(), refetchType: "all" });

      queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.all(), refetchType: "all" });

      queryClient.invalidateQueries({ queryKey: QueryKeys.Entry.getEntries(), refetchType: "all" });

      setSelectedScheduleContext(undefined);
      closeScheduleDetail();
    },
    onError: (error: any) => {
      if (error.response?.data instanceof ApiErrorResponseData) {
        toast.error({
          title: "Ops...",
          description: error.response.data.message || "Erro desconhecido",
          topOffset: toastOffset,
        });
      }
    },
  });

  const renderItem = useCallback(
    ({ item }: { item: Schedule }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTime = today.getTime();

      let relevantCycle = item.cycles?.[0];
      if (item.cycles && item.cycles.length > 0) {
        let maxPastCycle = null;
        let maxPastTime = -Infinity;

        for (const cycle of item.cycles) {
          const cycleDate = new Date(cycle.expectedDate);
          cycleDate.setHours(0, 0, 0, 0);
          const cycleTime = cycleDate.getTime();

          if (cycleTime <= todayTime && cycleTime > maxPastTime) {
            maxPastTime = cycleTime;
            maxPastCycle = cycle;
          }
        }

        if (maxPastCycle) {
          relevantCycle = maxPastCycle;
        }
      }

      let dateStr = today.toISOString().split("T")[0];
      if (relevantCycle?.expectedDate) {
        dateStr = relevantCycle.expectedDate.split("T")[0];
      }

      const isDone = relevantCycle?.status === ScheduleCycleStatus.Done;
      const entryId = relevantCycle?.occurrence?.entryId;

      return (
        <ScheduleListItem
          schedule={item}
          isDone={isDone}
          onPress={() => openScheduleDetail(item, dateStr, isDone, entryId)}
          onCheckPress={() => {
            if (!isDone) {
              createOccurrenceMutation.mutate({ schedule: item });
            } else if (entryId) {
              deleteOccurrenceEntryMutation.mutate({ entryId });
            }
          }}
        />
      );
    },
    [openScheduleDetail, createOccurrenceMutation, deleteOccurrenceEntryMutation],
  );

  return (
    <TabbedLayout>
      <Navigation
        SubHeaderComponent={
          <AppSegmentedControl
            style={{ height: AppLayoutConstants.subHeaderHeight }}
            className="w-full"
            value={viewMode}
            onChange={(value) => setViewMode(value as "list" | "calendar")}
            options={[
              {
                value: "list",
                label: "Lista",
                icon: "format-list-bulleted",
              },
              {
                value: "calendar",
                label: "Calendário",
                icon: "calendar-month",
              },
            ]}
          />
        }
      />

      {viewMode === "list" ? (
        <ScheduleList renderItem={renderItem} />
      ) : (
        <SchedulesCalendarView
          schedules={schedules}
          onCheckPress={(item, _, isDone, entryId) => {
            if (!isDone) {
              createOccurrenceMutation.mutate({ schedule: item });
            } else if (entryId) {
              deleteOccurrenceEntryMutation.mutate({ entryId });
            }
          }}
          onSchedulePress={(item, dateStr, isDone, entryId) => openScheduleDetail(item, dateStr, isDone, entryId)}
        />
      )}

      <AppFabOverlay>
        <FAB icon="plus" size="large" onPress={() => openScheduleForm()} />
      </AppFabOverlay>

      <ScheduleFormOverlay
        ref={scheduleFormOverlayRef}
        onSuccess={(schedule, mode) => {
          queryClient.invalidateQueries({ queryKey: QueryKeys.Schedule.getSchedules(), refetchType: "all" });

          closeScheduleForm();
        }}
      />

      <AppBottomSheet
        imperative
        ref={detailBottomSheetRef}
        onCloseAnimationFinished={() => {
          setSelectedScheduleContext(undefined);
        }}
      >
        <View className="flex flex-col gap-4">
          <View className="flex flex-row justify-between items-center gap-4">
            <View style={{ flexShrink: 1 }}>
              {!!selectedSchedule ? (
                <Text style={{ flexShrink: 1 }} variant="titleMedium" ellipsizeMode="tail" numberOfLines={1}>
                  {selectedSchedule?.category?.name || "Sem categoria"}
                </Text>
              ) : (
                <AppSkeleton height={20} width={144} />
              )}
            </View>

            <View className="flex flex-row">
              <IconButton
                disabled={!selectedSchedule}
                icon="pencil"
                iconColor={theme.colors.primary}
                onPress={() => {
                  if (!selectedSchedule) return;

                  scheduleFormOverlayRef.current?.form.setForm({
                    id: selectedSchedule.id,
                    type: selectedSchedule.type,
                    category: {
                      id: selectedSchedule.category?.id || "",
                    },
                    amount: selectedSchedule.amount,
                    description: selectedSchedule.description,
                    referenceTimestamp: new Date(selectedSchedule.referenceTimestamp),
                    frequency: selectedSchedule.frequency,
                    dayOfWeek: selectedSchedule.dayOfWeek,
                  });

                  openScheduleForm();
                }}
              />
              <AppConfirmationDialog
                trigger={({ open }) => {
                  return <IconButton disabled={!selectedSchedule} icon="trash-can" iconColor={theme.colors.error} onPress={open} />;
                }}
                title="Remover agendamento?"
                description="Tem certeza de que deseja remover este agendamento? Não será possível recuperá-lo."
                confirmText="Tenho certeza"
                onConfirm={async (close) => {
                  await scheduleDeleteMutation.mutateAsync(selectedSchedule!);

                  close();
                }}
                confirmButtonProps={{
                  loading: scheduleDeleteMutation.isPending,
                  disabled: scheduleDeleteMutation.isPending,
                }}
                closeOnCancel
              />
            </View>
          </View>

          {!!selectedSchedule ? (
            <Text variant="bodyMedium">{selectedSchedule?.description || "Sem descrição"}</Text>
          ) : (
            <View className="flex gap-2">
              <AppSkeleton height={20} />
              <AppSkeleton height={20} />
            </View>
          )}

          <View className="flex flex-row justify-between items-center">
            {!!selectedSchedule ? (
              <AppHideableCurrencyText
                variant="bodyMedium"
                style={{
                  color: selectedSchedule?.type === EntryTypes.Expense ? theme.colors.error : theme.colors.success,
                }}
              >
                {currencyFormatter.format(selectedSchedule?.amount || 0)}
              </AppHideableCurrencyText>
            ) : (
              <AppSkeleton height={20} width={80} />
            )}

            {!!selectedSchedule ? (
              <View className="flex flex-row items-center gap-2">
                <Text>{selectedSchedule.frequency === ScheduleFrequency.Weekly ? "Semanal" : "Mensal"}</Text>
                <Checkbox
                  status={selectedScheduleContext?.isDone ? "checked" : "unchecked"}
                  onPress={() => {
                    if (!selectedScheduleContext?.isDone) {
                      createOccurrenceMutation.mutate({ schedule: selectedScheduleContext?.schedule! });
                    } else if (selectedScheduleContext.entryId) {
                      deleteOccurrenceEntryMutation.mutate({ entryId: selectedScheduleContext.entryId });
                    }
                  }}
                  disabled={createOccurrenceMutation.isPending || deleteOccurrenceEntryMutation.isPending}
                />
              </View>
            ) : (
              <AppSkeleton height={20} width={80} />
            )}
          </View>
        </View>
      </AppBottomSheet>
    </TabbedLayout>
  );
}
