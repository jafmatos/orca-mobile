import { useCategories } from "@/hooks/queries/use-categories";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppToast } from "@/hooks/use-app-toast";
import { EntryTypes } from "@/models/Entry";
import { ExportEntriesArguments, ListEntriesArguments } from "@/services/EntryService";
import { Portal } from "@gorhom/portal";
import { useMutation } from "@tanstack/react-query";
import { BottomSheetRef } from "jam-bottomsheet";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Dialog, IconButton, Searchbar, Text } from "react-native-paper";
import { AppBottomSheet } from "../ui/AppBottomSheet";
import { AppChipSelect } from "../ui/AppChipSelect";
import { AppDatePicker } from "../ui/AppDatePicker";
import { FormField } from "../ui/FormField";

enum FilterDateOptions {
  Period = "period",
  Week = "week",
  Month = "month",
  Custom = "custom",
}

export type EntryFilterForm = Required<Required<ListEntriesArguments>["query"]>["filter"];

export interface EntryListHeaderProps {
  onFilterChange: (filter: EntryFilterForm) => void;
}

export function EntryListHeader(props: EntryListHeaderProps) {
  const [filterDateOption, setFilterDateOption] = useState<FilterDateOptions>(FilterDateOptions.Period);
  const [isEntryExportOpen, setIsEntryExportOpen] = useState(false);

  const toast = useAppToast();
  const theme = useAppTheme();
  const filterForm = useAppForm<EntryFilterForm>({
    category: undefined,
    text: "",
    type: undefined,
    when: undefined,
  });

  const entryExportMutation = useMutation({
    mutationFn: async (options: ExportEntriesArguments) => {
      // const permission = await ExpoPermissions.askAsync(ExpoPermissions.MEDIA_LIBRARY);
      // if (!permission.granted) {
      //   return;
      // }
      // console.log("permission granted");
      // const { data, headers } = await EntryService.exportEntries(options);
      // const fileName = headers["Content-Disposition"] || "lancamentos.csv";
      // const destination = new ExpoFileSystem.Directory(ExpoFileSystem.Paths.cache, "orca/downloads");
      // const file = new ExpoFileSystem.File(destination, fileName);
      // destination.create();
      // file.create();
      // file.write(data);
    },
    onError: (error) => {
      toast.error({
        title: "Ops...",
        description: error.message || "Erro desconhecido",
      });
    },
    onSuccess: (data) => {
      toast.success({
        title: "Exportação iniciada!",
        description: "Verifique seus downloads para acessar o arquivo.",
      });
    },
  });

  const filterBottomSheetRef = React.useRef<BottomSheetRef>(null);
  const openEntryFilter = () => filterBottomSheetRef.current?.open();
  const closeEntryFilter = () => filterBottomSheetRef.current?.close();
  const openEntryExport = () => setIsEntryExportOpen(true);
  const closeEntryExport = () => setIsEntryExportOpen(false);

  const categoryQuery = useCategories();

  return (
    <View className="flex flex-col gap-4">
      <View className="flex flex-row mb-4 gap-2">
        <Searchbar
          style={{ flex: 1 }}
          placeholder="Pesquisar..."
          value={filterForm.values.text || ""}
          onChangeText={filterForm.makeSetter("text")}
          onIconPress={() => props.onFilterChange?.(filterForm.values)}
          onClearIconPress={() => {
            const updatedFilter = filterForm.setValue("text", "");

            props.onFilterChange?.(updatedFilter);
          }}
        />
        <View className="flex flex-row">
          <IconButton mode="contained" icon="tune" size={24} onPress={openEntryFilter} />
          <IconButton mode="contained" icon="download" size={24} onPress={openEntryExport} />
        </View>
      </View>

      <AppBottomSheet imperative ref={filterBottomSheetRef} fullscreen>
        <View className="flex flex-col gap-4">
          <View className="flex flex-row items-center justify-between">
            <Text variant="headlineSmall">Filtros</Text>
            <Button
              mode="elevated"
              icon="close"
              onPress={() => {
                filterForm.clear();
                setFilterDateOption(FilterDateOptions.Period);
              }}
            >
              Limpar
            </Button>
          </View>

          <FormField>
            <FormField.Label>Data</FormField.Label>

            <AppChipSelect
              value={filterDateOption}
              options={[
                {
                  label: "Período",
                  value: FilterDateOptions.Period,
                },
                {
                  label: "Esta semana",
                  value: FilterDateOptions.Week,
                },
                {
                  label: "Este mês",
                  value: FilterDateOptions.Month,
                },
                {
                  label: "Personalizado",
                  value: FilterDateOptions.Custom,
                },
              ]}
              onChange={(option) => {
                setFilterDateOption(option);

                if (option === FilterDateOptions.Period) {
                  filterForm.setValue("when", undefined);
                } else if (option === FilterDateOptions.Week) {
                  const endOfToday = new Date();
                  const startOfWeekAtMidnight = new Date();
                  const dayOfWeek = startOfWeekAtMidnight.getDay();
                  const daysToDecrement = !dayOfWeek ? 6 : dayOfWeek - 1;

                  startOfWeekAtMidnight.setDate(startOfWeekAtMidnight.getDate() - daysToDecrement);
                  startOfWeekAtMidnight.setHours(0, 0, 0, 0);
                  endOfToday.setHours(23, 59, 59, 999);

                  filterForm.setValue("when", {
                    ge: startOfWeekAtMidnight,
                    le: endOfToday,
                  });
                } else if (option === FilterDateOptions.Month) {
                  const endOfToday = new Date();
                  const startOfMonthAtMidnight = new Date();

                  startOfMonthAtMidnight.setDate(1);
                  startOfMonthAtMidnight.setHours(0, 0, 0, 0);
                  endOfToday.setHours(23, 59, 59, 999);

                  filterForm.setValue("when", {
                    ge: startOfMonthAtMidnight,
                    le: endOfToday,
                  });
                }
              }}
            />

            {filterDateOption === FilterDateOptions.Custom && (
              <View className="mt-2 flex flex-row gap-4">
                <AppDatePicker
                  containerClassName="grow basis-0"
                  mode="outlined"
                  label="Início"
                  value={filterForm.values.when?.ge || new Date()}
                  onChange={(date) =>
                    filterForm.setValue("when", {
                      ...filterForm.values.when,
                      ge: date,
                    })
                  }
                />
                <AppDatePicker
                  containerClassName="grow basis-0"
                  mode="outlined"
                  label="Final"
                  value={filterForm.values.when?.le || new Date()}
                  onChange={(date) =>
                    filterForm.setValue("when", {
                      ...filterForm.values.when,
                      le: date,
                    })
                  }
                />
              </View>
            )}
          </FormField>

          <FormField>
            <FormField.Label>Tipo de lançamento</FormField.Label>

            <AppChipSelect<EntryFilterForm["type"]>
              value={filterForm.values.type}
              options={[
                {
                  value: undefined,
                  label: "Todos",
                },
                {
                  value: EntryTypes.Expense,
                  label: "Despesas",
                },
                {
                  value: EntryTypes.Income,
                  label: "Receitas",
                },
              ]}
              onChange={filterForm.makeSetter("type")}
            />
          </FormField>

          <FormField>
            <FormField.Label>Categoria</FormField.Label>

            <AppChipSelect<EntryFilterForm["category"]>
              value={filterForm.values.category}
              options={[
                {
                  value: undefined,
                  label: "Todas",
                },
                ...(categoryQuery.data?.data
                  .filter((category) => !filterForm.values.type || filterForm.values.type === (category.type as any))
                  .map((category) => {
                    return {
                      value: category.id,
                      label: category.name,
                    };
                  }) || []),
              ]}
              onChange={filterForm.makeSetter("category")}
            />
          </FormField>

          <Button
            mode="contained"
            onPress={() => {
              props.onFilterChange(filterForm.values);
              closeEntryFilter();
            }}
          >
            Aplicar
          </Button>
        </View>
      </AppBottomSheet>

      <Portal hostName="modal">
        <Dialog visible={isEntryExportOpen} onDismiss={closeEntryExport}>
          <Dialog.Title>Exportar</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Deseja exportar seus lançamentos? A lista de exportação será gerada a partir dos filtros aplicados.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor={theme.colors.onSurfaceVariant} onPress={closeEntryExport}>
              Cancelar
            </Button>
            <Button
              loading={entryExportMutation.isPending}
              disabled={entryExportMutation.isPending}
              onPress={() =>
                entryExportMutation.mutateAsync({
                  query: {
                    filter: filterForm.values,
                  },
                })
              }
            >
              Exportar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
