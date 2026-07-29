import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { BottomSheetRef } from "jam-bottomsheet";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { Schedule, ScheduleCycleStatus } from "@/models/Schedule";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ScheduleListItem } from "./ScheduleListItem";
import { Surface, Text } from "react-native-paper";
import { useAuthUser } from "@/hooks/queries/use-auth-user";

LocaleConfig.locales["pt-br"] = {
  monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
  monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  dayNames: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

interface SchedulesCalendarViewProps {
  schedules: Schedule[];
  onCheckPress: (schedule: Schedule, dateStr?: string, isDone?: boolean, entryId?: string) => void;
  onSchedulePress: (schedule: Schedule, dateStr?: string, isDone?: boolean, entryId?: string) => void;
}

export function SchedulesCalendarView({ schedules, onCheckPress, onSchedulePress }: SchedulesCalendarViewProps) {
  const theme = useAppTheme();
  const authUserQuery = useAuthUser();
  const user = authUserQuery.data?.user;
  const bottomSheetRef = React.useRef<BottomSheetRef>(null);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [currentMonth, setCurrentMonth] = useState({ year: today.getFullYear(), month: today.getMonth() + 1 });
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(todayStr);

  const schedulesInCalendar = useMemo(() => {
    const calendar: Record<string, (Schedule & { status: ScheduleCycleStatus })[]> = {};

    schedules.forEach((schedule) => {
      schedule.cycles?.forEach((cycle) => {
        const cycleDateString = new Date(cycle.expectedDate).toISOString().split("T")[0];

        calendar[cycleDateString] = [...(calendar[cycleDateString] || []), { ...schedule, status: cycle.status }];
      });
    });

    return calendar;
  }, [schedules]);

  const markedDates = useMemo(() => {
    const marks: any = {};
    const ge = user?.currentCycle?.start ? new Date(user.currentCycle.start) : new Date(0);
    const le = user?.currentCycle?.end ? new Date(user.currentCycle.end) : new Date(8640000000000000 - 1);

    if (user?.currentCycle?.start && user?.currentCycle?.end) {
      let safetyCount = 0;
      const iterationDate = new Date(ge);
      const geDate = new Date(ge);
      const leDate = new Date(le);
      const geDateString = geDate.toISOString().split("T")[0];
      const leDateString = leDate.toISOString().split("T")[0];

      while (iterationDate.toISOString().split("T")[0].localeCompare(leDateString) <= 0 && safetyCount < 32) {
        const iterationDateString = iterationDate.toISOString().split("T")[0];

        marks[iterationDateString] = {
          color: theme.colors.surfaceVariant,
          textColor: theme.colors.onSurfaceVariant,
        };

        if (iterationDateString === geDateString) marks[iterationDateString].startingDay = true;
        if (iterationDateString === leDateString) marks[iterationDateString].endingDay = true;

        if (schedulesInCalendar[iterationDateString]?.length) {
          marks[iterationDateString] = {
            ...marks[iterationDateString],
            color: theme.colors.primary,
            textColor: theme.colors.onPrimary,
          };
        }

        if (
          schedulesInCalendar[iterationDateString]?.length &&
          schedulesInCalendar[iterationDateString].some((s) => s.status === ScheduleCycleStatus.Overdue)
        ) {
          marks[iterationDateString] = {
            ...marks[iterationDateString],
            color: theme.colors.error,
            textColor: theme.colors.onError,
          };
        }

        if (
          schedulesInCalendar[iterationDateString]?.length &&
          schedulesInCalendar[iterationDateString].every((s) => s.status === ScheduleCycleStatus.Done)
        ) {
          marks[iterationDateString] = {
            ...marks[iterationDateString],
            color: theme.colors.success,
            textColor: theme.colors.onSuccess,
          };
        }

        iterationDate.setDate(iterationDate.getDate() + 1);

        safetyCount++;
      }
    }

    return marks;
  }, [user?.currentCycle?.start, user?.currentCycle?.end, currentMonth, theme, selectedDateStr, schedulesInCalendar]);

  const schedulesForSelectedDate = useMemo(() => {
    if (!selectedDateStr) return [];

    return schedules.filter((schedule) => {
      return schedule.cycles?.some((cycle) => cycle.expectedDate.split("T")[0] === selectedDateStr);
    });
  }, [schedules, selectedDateStr]);

  const geDate = user?.currentCycle?.start ? new Date(user.currentCycle.start) : new Date();
  const leDate = user?.currentCycle?.end ? new Date(user.currentCycle.end) : new Date();

  const isLeftDisabled =
    currentMonth.year < geDate.getFullYear() || (currentMonth.year === geDate.getFullYear() && currentMonth.month <= geDate.getMonth() + 1);
  const isRightDisabled =
    currentMonth.year > leDate.getFullYear() || (currentMonth.year === leDate.getFullYear() && currentMonth.month >= leDate.getMonth() + 1);

  return (
    <View style={{ flex: 1 }}>
      <Surface style={{ borderRadius: theme.roundness, overflow: "hidden", margin: 16 }}>
        <Calendar
          disableArrowLeft={isLeftDisabled}
          disableArrowRight={isRightDisabled}
          hideExtraDays={true}
          markingType={"period"}
          current={`${currentMonth.year}-${String(currentMonth.month).padStart(2, "0")}-01`}
          onMonthChange={(month: DateData) => setCurrentMonth({ year: month.year, month: month.month })}
          onDayPress={(day: DateData) => {
            setSelectedDateStr(day.dateString);

            bottomSheetRef.current?.open();
          }}
          markedDates={markedDates}
          theme={{
            calendarBackground: "transparent",
            textSectionTitleColor: theme.colors.onSurfaceVariant,
            selectedDayBackgroundColor: theme.colors.primaryContainer,
            selectedDayTextColor: theme.colors.onPrimaryContainer,
            todayTextColor: theme.colors.primary,
            dayTextColor: theme.colors.onSurface,
            textDisabledColor: theme.colors.surfaceDisabled,
            dotColor: theme.colors.primary,
            arrowColor: theme.colors.primary,
            disabledArrowColor: theme.colors.surfaceDisabled,
            monthTextColor: theme.colors.onSurface,
            indicatorColor: theme.colors.primary,
            textDayFontFamily: "System",
            textMonthFontFamily: "System",
            textDayHeaderFontFamily: "System",
            textDayFontWeight: "400",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "bold",
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
          }}
        />
      </Surface>

      <AppBottomSheet imperative ref={bottomSheetRef} expandable>
        <View className="flex flex-col gap-4">
          <Text variant="titleMedium">
            {selectedDateStr === todayStr
              ? "Agendamentos de hoje"
              : `Agendamentos do dia ${selectedDateStr?.split("-")[2]} de ${selectedDateStr ? LocaleConfig.locales["pt-br"].monthNames[parseInt(selectedDateStr?.split("-")[1]) - 1].toLowerCase() : ""}`}
          </Text>

          <View className="flex gap-4">
            {schedulesForSelectedDate.length > 0 ? (
              schedulesForSelectedDate.map((item) => {
                const cycle = item.cycles?.find((c) => c.expectedDate?.split("T")[0] === selectedDateStr);
                const isDone = cycle?.status === ScheduleCycleStatus.Done;

                return (
                  <ScheduleListItem
                    key={item.id}
                    schedule={item}
                    isDone={isDone}
                    onPress={() => {
                      bottomSheetRef.current?.close();
                      onSchedulePress(item, selectedDateStr!, isDone, cycle?.occurrence?.entryId);
                    }}
                    onCheckPress={() => onCheckPress(item, selectedDateStr!, isDone, cycle?.occurrence?.entryId)}
                  />
                );
              })
            ) : (
              <Text style={{ textAlign: "center", color: theme.colors.onSurfaceVariant }}>
                {selectedDateStr === todayStr ? "Nenhum agendamento para hoje." : "Nenhum agendamento para este dia."}
              </Text>
            )}
          </View>
        </View>
      </AppBottomSheet>
    </View>
  );
}
