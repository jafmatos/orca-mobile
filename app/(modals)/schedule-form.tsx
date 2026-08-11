import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { AppCurrencyInput } from "@/components/ui/AppCurrencyInput";
import { AppDropdownSelect } from "@/components/ui/AppDropdownSelect";
import { AppFormField } from "@/components/ui/AppFormField";
import { AppModalHeader } from "@/components/ui/AppModalHeader";
import { AppSelect } from "@/components/ui/AppSelect";
import { AppTextInput } from "@/components/ui/AppTextInput";
import { AppTimePicker } from "@/components/ui/AppTimePicker";
import { AppKeyboardDismissing } from "@/components/utils/AppKeyboardDismissing";
import { useCategories } from "@/hooks/queries/use-categories";
import { useSchedules } from "@/hooks/queries/use-schedules";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ApiErrorResponseData } from "@/models/ApiErrorResponseData";
import { EntryTypes } from "@/models/Entry";
import { Schedule, ScheduleFrequency } from "@/models/Schedule";
import {
  CreateScheduleBody,
  CreateScheduleReturnType,
  ScheduleService,
  UpdateScheduleBody,
  UpdateScheduleReturnType,
} from "@/services/Api/ScheduleApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import { Button, HelperText, TextInput as PaperTextInput, SegmentedButtons } from "react-native-paper";

function timeStringToDate(time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function dateToTimeString(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export type ScheduleCreateOrUpdateForm = {
  id?: Schedule["id"];
  frequency: ScheduleFrequency;
  type: EntryTypes;
  amount: number;
  description: string;
  time: string;
  timezone: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  category?: { id: string } | null;
};

export default function ScheduleFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useAppTheme();

  const schedulesQuery = useSchedules();

  const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const scheduleForm = useAppForm<ScheduleCreateOrUpdateForm>({
    type: EntryTypes.Expense,
    category: { id: "" },
    amount: 0,
    description: "",
    time: dateToTimeString(new Date()),
    timezone: defaultTimezone,
    frequency: ScheduleFrequency.Monthly,
    dayOfMonth: new Date().getDate(),
    dayOfWeek: new Date().getDay(),
  });
  const categoryQuery = useCategories();

  useEffect(() => {
    if (id && schedulesQuery.data?.data) {
      const schedules = schedulesQuery.data.data;
      const schedule = schedules.find((s) => s.id === id);
      if (schedule) {
        scheduleForm.setForm({
          id: schedule.id,
          type: schedule.type,
          category: schedule.category ? { id: schedule.category.id } : { id: "" },
          amount: schedule.amount,
          description: schedule.description || "",
          time: schedule.time,
          timezone: schedule.timezone,
          frequency: schedule.frequency,
          dayOfWeek: schedule.dayOfWeek,
          dayOfMonth: schedule.dayOfMonth,
        });
      }
    }
  }, [id, schedulesQuery.data?.data]);

  const { mutation: scheduleCreateOrUpdateMutation } = useAppFormWithMutation<
    ScheduleCreateOrUpdateForm,
    ScheduleCreateOrUpdateForm,
    CreateScheduleReturnType | UpdateScheduleReturnType
  >(scheduleForm, {
    mutationFn: (body) => {
      const { id: _id, ...rest } = body;

      if (scheduleForm.values.id) return ScheduleService.update(scheduleForm.values.id, rest as UpdateScheduleBody);
      else return ScheduleService.create(rest as CreateScheduleBody);
    },
    onSuccess: () => {
      scheduleForm.clear();
      queryClient.invalidateQueries({ queryKey: QueryKeys.Schedule.getSchedules() });

      router.back();
    },
    onError: (error: any) => {
      if (error.response?.data instanceof ApiErrorResponseData) {
        console.error(error.response.data.message);
      } else {
        console.error(JSON.stringify(error, null, 2));
      }
    },
  });

  const categoryOptions = useMemo(() => {
    return (
      categoryQuery.data?.data
        .filter((category) => category.type === (scheduleForm.values.type as string))
        .map((category) => {
          return {
            label: category.name,
            value: category.id,
          };
        }) || []
    );
  }, [categoryQuery.data?.data, scheduleForm.values.type]);

  const dayOfMonthOptions = useMemo(() => {
    return Array.from({ length: 28 }, (_, index) => {
      return {
        label: `Dia ${index + 1}`,
        value: index + 1,
      };
    });
  }, []);

  return (
    <FullScreenLayout>
      <AppModalHeader title={!!scheduleForm.values.id ? "Editar agendamento" : "Novo agendamento"} />
      <AppKeyboardDismissing.ScrollView>
        <View className="p-4 flex flex-col gap-4">
          <AppFormField>
            <SegmentedButtons
              value={scheduleForm.values.type}
              onValueChange={scheduleForm.makeSetter("type")}
              buttons={[
                {
                  label: "Despesa",
                  value: EntryTypes.Expense,
                },
                {
                  label: "Receita",
                  value: EntryTypes.Income,
                },
              ]}
              theme={{
                colors: {
                  secondaryContainer: theme.colors.surfaceVariant,
                  onSecondaryContainer: theme.colors.onSurfaceVariant,
                },
              }}
            />
          </AppFormField>

          <AppFormField>
            <AppSelect
              mode="outlined"
              label="Categoria"
              value={scheduleForm.values.category?.id || ""}
              onChange={(id) => scheduleForm.setValue("category", { id })}
              closeOnSelect
              options={categoryOptions}
            />

            {scheduleForm.hasError("category") && (
              <HelperText type="error" visible={true}>
                {scheduleForm.getError("category")}
              </HelperText>
            )}
          </AppFormField>

          <View className="flex flex-row gap-4">
            <AppFormField className="grow basis-0">
              <AppCurrencyInput
                mode="outlined"
                label="Valor"
                value={scheduleForm.values.amount}
                defaultValue={0}
                onChange={scheduleForm.makeSetter("amount")}
                error={scheduleForm.hasError("amount")}
              />

              {scheduleForm.hasError("amount") && (
                <HelperText type="error" visible={true}>
                  {scheduleForm.getError("amount")}
                </HelperText>
              )}
            </AppFormField>
          </View>

          <AppFormField>
            <AppTextInput
              mode="outlined"
              label="Descrição"
              value={scheduleForm.values.description}
              onChangeText={scheduleForm.makeSetter("description")}
              autoCorrect={false}
              spellCheck={false}
              autoComplete="off"
              right={
                <PaperTextInput.Affix
                  textStyle={{
                    color: scheduleForm.values.description.length > 60 ? theme.colors.error : theme.colors.onBackground,
                  }}
                  text={`${scheduleForm.values.description.length}/60`}
                />
              }
            />

            {scheduleForm.hasError("description") && (
              <HelperText type="error" visible={true}>
                {scheduleForm.getError("description")}
              </HelperText>
            )}
          </AppFormField>

          <AppFormField>
            <AppDropdownSelect<ScheduleFrequency>
              label="Frequência"
              mode="outlined"
              value={scheduleForm.values.frequency}
              onChange={scheduleForm.makeSetter("frequency")}
              options={[
                {
                  label: "Mensal",
                  value: ScheduleFrequency.Monthly,
                },
                {
                  label: "Semanal",
                  value: ScheduleFrequency.Weekly,
                },
              ]}
              theme={{
                colors: {
                  secondaryContainer: theme.colors.surfaceVariant,
                  onSecondaryContainer: theme.colors.onSurfaceVariant,
                },
              }}
            />

            {scheduleForm.hasError("frequency") && (
              <HelperText type="error" visible={true}>
                {scheduleForm.getError("frequency")}
              </HelperText>
            )}
          </AppFormField>

          <View className="flex flex-row gap-4">
            {scheduleForm.values.frequency === ScheduleFrequency.Weekly ? (
              <AppFormField className="grow basis-0">
                <AppSelect
                  mode="outlined"
                  label="Dia da Semana"
                  value={scheduleForm.values.dayOfWeek?.toString() || String(new Date().getDay())}
                  onChange={(val) => scheduleForm.setValue("dayOfWeek", parseInt(val))}
                  closeOnSelect
                  options={[
                    { label: "Domingo", value: "0" },
                    { label: "Segunda", value: "1" },
                    { label: "Terça", value: "2" },
                    { label: "Quarta", value: "3" },
                    { label: "Quinta", value: "4" },
                    { label: "Sexta", value: "5" },
                    { label: "Sábado", value: "6" },
                  ]}
                />

                {scheduleForm.hasError("dayOfWeek") && (
                  <HelperText type="error" visible={true}>
                    {scheduleForm.getError("dayOfWeek")}
                  </HelperText>
                )}
              </AppFormField>
            ) : (
              <AppFormField className="grow basis-0">
                <AppSelect<number>
                  closeOnSelect
                  mode="outlined"
                  label="Dia do mês"
                  options={dayOfMonthOptions}
                  value={scheduleForm.values.dayOfMonth ?? new Date().getDate()}
                  onChange={(value) => scheduleForm.setValue("dayOfMonth", value)}
                  error={scheduleForm.hasError("dayOfMonth")}
                />

                {scheduleForm.hasError("dayOfMonth") && (
                  <HelperText type="error" visible={true}>
                    {scheduleForm.getError("dayOfMonth")}
                  </HelperText>
                )}
              </AppFormField>
            )}

            <AppFormField className="grow basis-0">
              <AppTimePicker
                mode="outlined"
                label="Horário"
                value={timeStringToDate(scheduleForm.values.time)}
                onChange={(date) => scheduleForm.setValue("time", dateToTimeString(date))}
                error={scheduleForm.hasError("time")}
              />

              {scheduleForm.hasError("time") && (
                <HelperText type="error" visible={true}>
                  {scheduleForm.getError("time")}
                </HelperText>
              )}
            </AppFormField>
          </View>

          <Button
            className="mt-2"
            mode="contained"
            onPress={() => scheduleCreateOrUpdateMutation.mutateAsync(scheduleForm.values)}
            loading={scheduleCreateOrUpdateMutation.isPending}
            disabled={scheduleCreateOrUpdateMutation.isPending || scheduleForm.hasErrors}
          >
            Pronto
          </Button>
        </View>
      </AppKeyboardDismissing.ScrollView>
    </FullScreenLayout>
  );
}
