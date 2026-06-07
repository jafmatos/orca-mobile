import { useAppTheme } from "@/hooks/use-app-theme";
import { EntryTypes } from "@/models/Entry";
import { Schedule, ScheduleFrequency } from "@/models/Schedule";
import { currencyFormatter } from "@/utils/currencyFormatter";
import React from "react";
import { Pressable, View } from "react-native";
import { Checkbox, Surface, Text } from "react-native-paper";
import { AppHideableCurrencyText } from "../ui/AppHideableCurrencyText";

export interface ScheduleListItemProps extends React.ComponentProps<typeof Pressable> {
  schedule: Schedule;
  isDone?: boolean;
  onCheckPress: (schedule: Schedule) => void;
}

const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function ScheduleListItem({ schedule, isDone, onCheckPress, ...pressableProps }: ScheduleListItemProps) {
  const theme = useAppTheme();

  const getFrequencyText = () => {
    const timeOfDay = new Date(schedule.referenceTimestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    if (schedule.frequency === ScheduleFrequency.Weekly) {
      const dayOfWeek = schedule.dayOfWeek !== undefined ? WEEKDAYS[schedule.dayOfWeek] : "";

      return `${dayOfWeek} às ${timeOfDay}`;
    }

    const date = new Date(schedule.referenceTimestamp).getDate();

    return `Dia ${date} às ${timeOfDay}`;
  };

  return (
    <Pressable {...pressableProps}>
      <Surface style={{ borderRadius: theme.roundness }}>
        <View className="p-4 flex flex-row gap-2 items-center">
          <View className="-ml-3">
            <Checkbox
              status={isDone ? "checked" : "unchecked"}
              onPress={(event) => {
                event.stopPropagation();
                onCheckPress(schedule);
              }}
            />
          </View>

          <View className="flex flex-col flex-1 gap-2">
            <View className="flex flex-row items-center justify-between gap-4">
              <View className="flex flex-row gap-2 items-center" style={{ flexShrink: 1 }}>
                {/* {schedule.isOverdue && <Icon source="alert-circle" size={16} color={theme.colors.error} />} */}

                <Text style={{ flexShrink: 1 }} numberOfLines={1} ellipsizeMode="tail" variant="titleMedium">
                  {schedule.category?.name || "Sem categoria"}
                </Text>
              </View>

              <AppHideableCurrencyText style={{ color: schedule.type === EntryTypes.Expense ? theme.colors.error : theme.colors.success }}>
                {currencyFormatter.format(schedule.amount)}
              </AppHideableCurrencyText>
            </View>

            <View className="flex flex-row items-center justify-between gap-4">
              <Text style={{ flexShrink: 1 }} variant="bodyMedium" ellipsizeMode="tail" numberOfLines={1}>
                {schedule.description || "Sem descrição"}
              </Text>

              <Text variant="bodySmall">{getFrequencyText()}</Text>
            </View>
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}
