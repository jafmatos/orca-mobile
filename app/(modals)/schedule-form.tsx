import { useCategories } from "@/hooks/queries/use-categories";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { useAppTheme } from "@/hooks/use-app-theme";
import { EntryTypes } from "@/models/Entry";
import { Schedule, ScheduleFrequency } from "@/models/Schedule";
import {
  CreateScheduleBody,
  CreateScheduleReturnType,
  ScheduleService,
  UpdateScheduleBody,
  UpdateScheduleReturnType,
} from "@/services/Api/ScheduleApiService";
import React, { useMemo, useEffect } from "react";
import { View } from "react-native";
import { Button, HelperText, SegmentedButtons, TextInput as PaperTextInput } from "react-native-paper";
import { AppTextInput } from "@/components/ui/AppTextInput";
import { AppCurrencyInput } from "@/components/ui/AppCurrencyInput";
import { AppSelect } from "@/components/ui/AppSelect";
import { FormField } from "@/components/ui/FormField";
import { AppDropdownSelect } from "@/components/ui/AppDropdownSelect";
import { AppTimePicker } from "@/components/ui/AppTimePicker";
import { ApiErrorResponseData } from "@/models/ApiErrorResponseData";
import { AppKeyboardDismissing } from "@/components/ui/AppKeyboardDismissing";
import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { AppModalHeader } from "@/components/ui/AppModalHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/utils/QueryKeys";
import { useSchedules } from "@/hooks/queries/use-schedules";

export type ScheduleCreateOrUpdateForm = CreateScheduleBody &
  UpdateScheduleBody & {
    id?: Schedule["id"];
  };

export default function ScheduleFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useAppTheme();
  
  const schedulesQuery = useSchedules();

  const scheduleForm = useAppForm<ScheduleCreateOrUpdateForm>({
    type: EntryTypes.Expense,
    category: {
      id: "",
    },
    amount: 0,
    description: "",
    referenceTimestamp: new Date(),
    frequency: ScheduleFrequency.Monthly,
    dayOfWeek: undefined,
  });
  const categoryQuery = useCategories();

  useEffect(() => {
    if (id && schedulesQuery.data?.pages) {
      const schedules = schedulesQuery.data.pages.flatMap((p) => p.data);
      const schedule = schedules.find((s) => s.id === id);
      if (schedule) {
        scheduleForm.setForm({
          id: schedule.id,
          type: schedule.type,
          category: schedule.category ? { id: schedule.category.id } : { id: "" },
          amount: schedule.amount,
          description: schedule.description,
          referenceTimestamp: new Date(schedule.referenceTimestamp),
          frequency: schedule.frequency,
          dayOfWeek: schedule.dayOfWeek,
        });
      }
    }
  }, [id, schedulesQuery.data?.pages]);

  const { mutation: scheduleCreateOrUpdateMutation } = useAppFormWithMutation<
    ScheduleCreateOrUpdateForm,
    CreateScheduleBody & UpdateScheduleBody,
    CreateScheduleReturnType | UpdateScheduleReturnType
  >(scheduleForm, {
    mutationFn: (body) => {
      if (scheduleForm.values.id) return ScheduleService.update(scheduleForm.values.id!, body);
      else return ScheduleService.create(body);
    },
    onSuccess: (data) => {
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
          <FormField>
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
          </FormField>

          <FormField>
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
          </FormField>

          <View className="flex flex-row gap-4">
            <FormField className="grow basis-0">
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
            </FormField>
          </View>

          <FormField>
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
          </FormField>

          <FormField>
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
          </FormField>

          <View className="flex flex-row gap-4">
            {scheduleForm.values.frequency === ScheduleFrequency.Weekly ? (
              <FormField className="grow basis-0">
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
              </FormField>
            ) : (
              <FormField className="grow basis-0">
                <AppSelect<number>
                  closeOnSelect
                  mode="outlined"
                  label="Dia do mês"
                  options={dayOfMonthOptions}
                  value={scheduleForm.values.referenceTimestamp.getDate()}
                  onChange={(value) => {
                    const newValue = new Date(scheduleForm.values.referenceTimestamp);

                    newValue.setDate(value);

                    scheduleForm.setValue("referenceTimestamp", newValue);
                  }}
                  error={scheduleForm.hasError("referenceTimestamp")}
                />

                {scheduleForm.hasError("referenceTimestamp") && (
                  <HelperText type="error" visible={true}>
                    {scheduleForm.getError("referenceTimestamp")}
                  </HelperText>
                )}
              </FormField>
            )}

            <FormField className="grow basis-0">
              <AppTimePicker
                mode="outlined"
                label="Horário"
                value={scheduleForm.values.referenceTimestamp}
                onChange={(value) => scheduleForm.setValue("referenceTimestamp", value)}
                error={scheduleForm.hasError("referenceTimestamp")}
              />

              {scheduleForm.hasError("referenceTimestamp") && (
                <HelperText type="error" visible={true}>
                  {scheduleForm.getError("referenceTimestamp")}
                </HelperText>
              )}
            </FormField>
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
