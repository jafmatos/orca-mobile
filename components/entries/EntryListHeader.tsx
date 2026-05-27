import { useCategories } from "@/hooks/queries/use-categories";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppToast } from "@/hooks/use-app-toast";
import { EntryTypes } from "@/models/Entry";
import { EntryService, ExportEntriesArguments, ListEntriesArguments } from "@/services/EntryService";
import { Portal } from "@gorhom/portal";
import { useMutation } from "@tanstack/react-query";
import { Paths, File } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { BottomSheetRef } from "jam-bottomsheet";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Chip, Dialog, IconButton, Searchbar, Text } from "react-native-paper";
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

const filterDateOptionsMap = new Map<FilterDateOptions | undefined, string>([
  [undefined, "Período"],
  [FilterDateOptions.Week, "Esta semana"],
  [FilterDateOptions.Month, "Este mês"],
  [FilterDateOptions.Custom, "Personalizado"],
]);

const filterDateOptions = Array.from(filterDateOptionsMap.entries()).map(([value, label]) => ({
  value,
  label,
}));

const filterTypeOptionsMap = new Map<EntryTypes | undefined, string>([
  [undefined, "Todos"],
  [EntryTypes.Income, "Receita"],
  [EntryTypes.Expense, "Despesa"],
]);

const filterTypeOptions = Array.from(filterTypeOptionsMap.entries()).map(([value, label]) => ({
  value,
  label,
}));

export function EntryListHeader(props: EntryListHeaderProps) {
  const [filterDateOption, setFilterDateOption] = useState<FilterDateOptions | undefined>(undefined);
  const [activeFilters, setActiveFilters] = useState<{ [key in keyof EntryFilterForm]?: string }>({});
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
      const response = await EntryService.exportEntries(options);
      const csvData = response.data;

      const contentDisposition = response.headers["content-disposition"] || response.headers["Content-Disposition"];
      let fileName = "lancamentos.csv";
      if (typeof contentDisposition === "string") {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          fileName = match[1];
        }
      }

      const file = new File(Paths.cache, fileName);
      file.write(csvData);
      const localUri = file.uri;

      try {
        await Sharing.shareAsync(localUri, {
          mimeType: "text/csv",
          dialogTitle: "Exportar lançamentos",
        });
      } catch (shareError) {
        return;
      }
    },
    onError: (error) => {
      toast.error({
        title: "Ops...",
        description: error.message || "Erro desconhecido",
      });
    },
    onSuccess: () => {
      toast.success({
        title: "Lançamentos exportados!",
        description: "O arquivo foi salvo com sucesso.",
      });
      closeEntryExport();
    },
  });

  const filterBottomSheetRef = React.useRef<BottomSheetRef>(null);
  const openEntryFilter = () => filterBottomSheetRef.current?.open();
  const closeEntryFilter = () => filterBottomSheetRef.current?.close();
  const openEntryExport = () => setIsEntryExportOpen(true);
  const closeEntryExport = () => setIsEntryExportOpen(false);

  const categoryQuery = useCategories();

  return (
    <View className="flex flex-col">
      <View className="flex flex-row gap-2 mb-4">
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

      {Object.values(activeFilters).filter((v) => !!v).length > 0 && (
        <View className="flex flex-row flex-wrap gap-2 mb-4">
          {activeFilters.type && (
            <Chip
              compact
              mode="outlined"
              onClose={() => {
                const updatedFilter = filterForm.setValue("type", undefined);

                setActiveFilters({ ...activeFilters, type: undefined });

                props.onFilterChange?.(updatedFilter);
              }}
            >
              {activeFilters.type}
            </Chip>
          )}

          {activeFilters.when && (
            <Chip
              compact
              mode="outlined"
              onClose={() => {
                const updatedFilter = filterForm.setValue("when", undefined);

                setFilterDateOption(undefined);
                setActiveFilters({ ...activeFilters, when: undefined });

                props.onFilterChange?.(updatedFilter);
              }}
            >
              {activeFilters.when}
            </Chip>
          )}

          {activeFilters.category && (
            <Chip
              compact
              mode="outlined"
              onClose={() => {
                const updatedFilter = filterForm.setValue("category", undefined);
                setActiveFilters({ ...activeFilters, category: undefined });

                props.onFilterChange?.(updatedFilter);
              }}
            >
              {activeFilters.category}
            </Chip>
          )}
        </View>
      )}

      <AppBottomSheet imperative ref={filterBottomSheetRef} fullscreen>
        <View className="flex flex-col gap-4">
          <View className="flex flex-row items-center justify-between">
            <Text variant="headlineSmall">Filtros</Text>
            <Button
              mode="elevated"
              icon="close"
              onPress={() => {
                filterForm.clear();
                setFilterDateOption(undefined);
              }}
            >
              Limpar
            </Button>
          </View>

          <FormField>
            <FormField.Label>Data</FormField.Label>

            <AppChipSelect
              value={filterDateOption}
              options={filterDateOptions}
              onChange={(option) => {
                setFilterDateOption(option);

                if (!option || option === FilterDateOptions.Period) {
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
              options={filterTypeOptions}
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

              setActiveFilters({
                type: filterForm.values.type ? filterTypeOptionsMap.get(filterForm.values.type) : undefined,
                category: filterForm.values.category
                  ? categoryQuery.data?.data.find((c) => c.id === filterForm.values.category)?.name
                  : undefined,
                when: filterDateOptionsMap.get(filterDateOption),
              });
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
