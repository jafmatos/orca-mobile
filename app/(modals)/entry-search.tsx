import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { useCategories } from "@/hooks/queries/use-categories";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppToast } from "@/hooks/use-app-toast";
import { Entry, EntryTypes } from "@/models/Entry";
import { DeleteEntryReturnType, EntryService, ExportEntriesArguments, ListEntriesArguments } from "@/services/Api/EntryApiService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { File, Paths } from "expo-file-system";
import { PortalHost } from "@gorhom/portal";
import * as Sharing from "expo-sharing";
import { BottomSheetRef } from "jam-bottomsheet";
import React, { useRef, useState, useEffect } from "react";
import { Keyboard, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppLayoutConstants } from "@/constants/layout";
import { Button, Chip, IconButton, Searchbar, Text } from "react-native-paper";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { AppChipSelect } from "@/components/ui/AppChipSelect";
import { AppDatePicker } from "@/components/ui/AppDatePicker";
import { FormField } from "@/components/ui/FormField";
import { EntryFilter, EntryList } from "@/components/entries/EntryList";
import { EntryListItem } from "@/components/entries/EntryListItem";
import { useRouter } from "expo-router";
import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { AppKeyboardDismissing } from "@/components/ui/AppKeyboardDismissing";
import { EntryDetailBottomSheet } from "@/components/entries/EntryDetailBottomSheet";
import { QueryKeys } from "@/utils/QueryKeys";

enum FilterDateOptions {
  Period = "period",
  Week = "week",
  Month = "month",
  Custom = "custom",
}

export type EntryFilterForm = Required<Required<ListEntriesArguments>["query"]>["filter"];

const filterDateOptionsMap = new Map<FilterDateOptions | undefined, string>([
  [undefined, "Completo"],
  [FilterDateOptions.Period, "Período"],
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

export default function EntrySearchScreen() {
  const searchBarRef = useRef<React.ElementRef<typeof Searchbar>>(null);
  const filterBottomSheetRef = useRef<BottomSheetRef>(null);
  const exportBottomSheetRef = useRef<BottomSheetRef>(null);
  const detailBottomSheetRef = useRef<BottomSheetRef>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedEntry, setSelectedEntry] = useState<Entry>();

  const openEntryFilter = () => {
    Keyboard.dismiss();
    filterBottomSheetRef.current?.open();
  };
  const closeEntryFilter = () => filterBottomSheetRef.current?.close();
  const openEntryExport = () => {
    Keyboard.dismiss();
    exportBottomSheetRef.current?.open();
  };
  const closeEntryExport = () => exportBottomSheetRef.current?.close();

  const [filterDateOption, setFilterDateOption] = useState<FilterDateOptions | undefined>(undefined);
  const [activeFilters, setActiveFilters] = useState<{ [key in keyof EntryFilterForm]?: string }>({});
  const [filter, setFilter] = useState<EntryFilter>({});

  const toast = useAppToast();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const toastOffset = insets.top + AppLayoutConstants.headerHeight + AppLayoutConstants.toastBaseOffset;
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
        topOffset: toastOffset,
      });
    },
    onSuccess: () => {
      closeEntryExport();
    },
  });

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
      queryClient.invalidateQueries({ queryKey: QueryKeys.Entry.getEntries() });

      setSelectedEntry(undefined);
      detailBottomSheetRef.current?.close();
    },
  });

  const categoryQuery = useCategories();
  const authUserQuery = useAuthUser();
  const user = authUserQuery.data?.user;

  useEffect(() => {
    setTimeout(() => {
      searchBarRef.current?.focus();
    }, 100);
  }, []);

  const handleApplyFilters = () => {
    const values = filterForm.values;

    setFilter(values);
    setActiveFilters({
      type: values.type ? filterTypeOptionsMap.get(values.type) : undefined,
      category: values.category ? categoryQuery.data?.data.find((c) => c.id === values.category)?.name : undefined,
      when: values.when ? filterDateOptionsMap.get(filterDateOption) : undefined,
    });
    closeEntryFilter();
  };

  return (
    <FullScreenLayout>
      <View
        className="px-4 h-[72px] flex flex-row gap-2 items-center"
        style={{
          backgroundColor: theme.colors.surface,
          boxShadow: `0 1px 3px -2px ${theme.colors.outlineVariant}`,
        }}
      >
        <AppKeyboardDismissing.View>
          <View className="flex flex-1 flex-row items-center gap-2 h-full w-full">
            <IconButton
              size={24}
              style={{ marginLeft: 0, width: 44, height: 44 }}
              iconColor={theme.colors.onBackground}
              icon="arrow-left"
              onPress={() => router.back()}
            />

            <Searchbar
              ref={searchBarRef}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 22,
                marginRight: 8,
                backgroundColor: theme.colors.backdrop,
              }}
              inputStyle={{ minHeight: 44, color: theme.colors.onBackground }}
              placeholderTextColor={theme.colors.onSurfaceDisabled}
              placeholder="Pesquisar..."
              value={filterForm.values.text || ""}
              onChangeText={filterForm.makeSetter("text")}
              onIconPress={() => setFilter(filterForm.values)}
              onClearIconPress={() => {
                const updatedFilter = filterForm.setValue("text", "");
                setFilter(updatedFilter);
              }}
              onSubmitEditing={() => setFilter(filterForm.values)}
            />

            <IconButton
              mode="contained"
              theme={{ colors: { surfaceVariant: theme.colors.backdrop, primary: theme.colors.onBackground } }}
              style={{ marginLeft: 0, width: 44, height: 44 }}
              icon="tune"
              size={24}
              onPress={openEntryFilter}
            />

            <IconButton
              mode="contained"
              theme={{ colors: { surfaceVariant: theme.colors.backdrop, primary: theme.colors.onBackground } }}
              style={{ marginLeft: 0, width: 44, height: 44 }}
              icon="download"
              size={24}
              onPress={openEntryExport}
            />
          </View>
        </AppKeyboardDismissing.View>
      </View>

      <View style={{ flex: 1 }}>
        <EntryList
          renderItem={({ item }) => (
            <EntryListItem
              data={item}
              onPress={() => {
                setSelectedEntry(item);
                detailBottomSheetRef.current?.open();
              }}
            />
          )}
          ListHeaderComponent={
            <View>
              {Object.values(activeFilters).filter((v) => !!v).length > 0 && (
                <View className="flex flex-row flex-wrap gap-2 pb-4 px-4 pt-4">
                  {activeFilters.type && (
                    <Chip
                      compact
                      mode="outlined"
                      onClose={() => {
                        const updatedFilter = filterForm.setValue("type", undefined);
                        setActiveFilters({ ...activeFilters, type: undefined });
                        setFilter(updatedFilter);
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
                        setFilter(updatedFilter);
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
                        setFilter(updatedFilter);
                      }}
                    >
                      {activeFilters.category}
                    </Chip>
                  )}
                </View>
              )}
            </View>
          }
          filter={filter}
        />
      </View>

      <AppBottomSheet imperative ref={filterBottomSheetRef} fullscreen portalHostName="entry-search-bottomsheet">
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
              allowUnselect
              value={filterDateOption}
              options={filterDateOptions}
              onChange={(option) => {
                setFilterDateOption(option);

                if (option === FilterDateOptions.Period && !!user) {
                  filterForm.setValue("when", { ge: new Date(user.periodGe), le: new Date(user.periodLe) });
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
                } else if (!option || !user) {
                  filterForm.setValue("when", undefined);
                } else {
                  filterForm.setValue("when", {
                    ge: new Date(user.periodGe),
                    le: new Date(user.periodLe),
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

          <Button mode="contained" onPress={handleApplyFilters}>
            Aplicar
          </Button>
        </View>
      </AppBottomSheet>

      <AppBottomSheet imperative ref={exportBottomSheetRef} portalHostName="entry-search-bottomsheet">
        <View className="flex flex-col">
          <View className="flex flex-row justify-between items-center pb-2">
            <Text variant="titleLarge">Exportar lançamentos</Text>
            <IconButton icon="close" onPress={closeEntryExport} style={{ margin: 0 }} />
          </View>

          <View className="pb-8">
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }} className="mb-6">
              Deseja gerar um arquivo com seus lançamentos? A lista de exportação será gerada a partir dos filtros que você aplicou.
            </Text>

            <View className="flex flex-row justify-end gap-2">
              <Button mode="text" textColor={theme.colors.onSurfaceVariant} onPress={closeEntryExport}>
                Cancelar
              </Button>

              <Button
                mode="contained"
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
            </View>
          </View>
        </View>
      </AppBottomSheet>

      <EntryDetailBottomSheet
        ref={detailBottomSheetRef}
        portalHostName="entry-search-bottomsheet"
        entry={selectedEntry}
        onCloseAnimationFinished={() => setSelectedEntry(undefined)}
        onDuplicate={(entry) => {
          detailBottomSheetRef.current?.close({
            onFinished: () => {
              router.push(`/(modals)/entry-manual-form?duplicateFromId=${entry.id}`);
            }
          });
        }}
        onEdit={(entry) => {
          detailBottomSheetRef.current?.close({
            onFinished: () => {
              router.push(`/(modals)/entry-manual-form?id=${entry.id}`);
            }
          });
        }}
        onDelete={async (entry) => {
          await entryDeleteMutation.mutateAsync(entry);
        }}
      />
      
      <PortalHost name="entry-search-bottomsheet" />
    </FullScreenLayout>
  );
}
