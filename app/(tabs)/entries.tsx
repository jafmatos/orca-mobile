// import { Buffer } from "@craftzdog/react-native-buffer";
import { Conditional } from "@/components/Conditional";
import { EndOfListWithLoading } from "@/components/EndOfListWithLoading";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { AppChipSelect } from "@/components/ui/AppChipSelect";
import { AppConfirmationDialog } from "@/components/ui/AppConfirmationDialog";
import { AppCurrencyInput } from "@/components/ui/AppCurrencyInput";
import { AppDatePicker } from "@/components/ui/AppDatePicker";
import { AppFabOverlay } from "@/components/ui/AppFabOverlay";
import { AppFullScreenOverlay } from "@/components/ui/AppFullScreenOverlay";
import { AppSelect } from "@/components/ui/AppSelect";
import { FormField } from "@/components/ui/FormField";
import { useCategories } from "@/hooks/queries/use-categories";
import { useEntries } from "@/hooks/queries/use-entries";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { useAppToast } from "@/hooks/use-app-toast";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Entry, EntryTypes } from "@/models/Entry";
import {
  CreateEntryBody,
  CreateEntryReturnType,
  DeleteEntryReturnType,
  EntryService,
  ExportEntriesArguments,
  UpdateEntryBody,
  UpdateEntryReturnType,
} from "@/services/EntryService";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { QueryKeys } from "@/utils/QueryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import {
  Button,
  Dialog,
  FAB,
  HelperText,
  IconButton,
  Portal,
  Searchbar,
  SegmentedButtons,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import Share from "react-native-share";

interface IEntryForm {
  id?: Entry["id"];
  type: EntryTypes;
  category: {
    id: string;
  };
  amount: number;
  description: string;
  when: Date;
}

interface IEntryFilter {
  text: string;
  type?: EntryTypes;
  category?: string;
  when?: {
    ge?: Date;
    le?: Date;
  };
}

enum FilterDateOptions {
  Period = "period",
  Week = "week",
  Month = "month",
  Custom = "custom",
}

export default function EntriesScreen() {
  const initialFormValues: IEntryForm = {
    type: EntryTypes.Expense,
    category: {
      id: "",
    },
    amount: 0,
    description: "",
    when: new Date(),
  };
  const initialEntryFilter: IEntryFilter = {
    type: undefined,
    category: undefined,
    text: "",
    when: undefined,
  };

  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false);
  const [isEntryFilterOpen, setIsEntryFilterOpen] = useState(false);
  const [isEntryExportOpen, setIsEntryExportOpen] = useState(false);
  const [filterDateOption, setFilterDateOption] = useState<FilterDateOptions>(FilterDateOptions.Period);
  const [selectedEntry, setSelectedEntry] = useState<Entry | undefined>();

  const toast = useAppToast();
  const theme = useAppTheme();
  const entryForm = useAppForm<IEntryForm>(initialFormValues);
  const entryFilter = useAppForm<IEntryFilter>(initialEntryFilter);
  const queryClient = useQueryClient();
  const categoryQuery = useCategories();
  const entryQuery = useEntries({
    filter: entryFilter.values,
  });

  const refreshList = useCallback(() => {
    queryClient.resetQueries({
      queryKey: QueryKeys.Entry.getEntries(),
      exact: true,
    });
  }, [queryClient]);

  const { mutation: entryCreateOrUpdateMutation } = useAppFormWithMutation<
    IEntryForm,
    CreateEntryBody & UpdateEntryBody,
    CreateEntryReturnType | UpdateEntryReturnType
  >(entryForm, {
    mutationFn: (body) => {
      if (entryForm.values.id) return EntryService.update(entryForm.values.id!, body);
      else return EntryService.create(body);
    },
    onSuccess: () => {
      entryForm.clear();

      if (entryForm.values.id) {
        toast.success({
          title: "Lançamento editado!",
          description: "Atualize a lista para ver as modificações.",
        });
      } else {
        toast.success({
          title: "Lançamento cadastrado!",
          description: "Atualize a lista para ver as modificações.",
        });
      }

      setIsEntryFormOpen(false);

      refreshList();
    },
  });

  const entryDeleteMutation = useMutation<DeleteEntryReturnType, Error, Entry>({
    mutationFn: (entry) => EntryService.delete(entry.id),
    onError: (error) => {
      toast.error({
        title: "Ops...",
        description: error.message || "Erro desconhecido",
      });
    },
    onSuccess: (data, entry) => {
      console.log(entry);
      toast.success({
        title: "Lançamento removido!",
        description: "Atualize a lista para ver as modificações.",
      });

      setSelectedEntry(undefined);

      refreshList();
    },
  });

  const entryExportMutation = useMutation({
    mutationFn: async (options: ExportEntriesArguments) => {
      // const data = await EntryService.exportEntries(options);
      // const base64Content = `data:text/csv;charset=utf-8;base64,${Buffer.from(data).toString("base64")}`;
      // await Share.open({
      //   url: base64Content,
      //   type: "text/csv",
      //   filename: "lancamentos.csv",
      //   title: "Exportar lançamentos",
      //   message: "Salvar CSV em:",
      // });
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

  const entries = useMemo(() => {
    return entryQuery.data?.pages.map((page) => page.data).flat() || [];
  }, [entryQuery]);

  const MemoizedListHeader = useMemo(() => {
    return (
      <View className="flex flex-col gap-4">
        <View className="flex flex-row mb-4 gap-2">
          <Searchbar
            style={{ flex: 1 }}
            placeholder="Pesquisar..."
            value={entryFilter.values.text}
            onChangeText={entryFilter.makeSetter("text")}
            onIconPress={refreshList}
            onClearIconPress={() => {
              entryFilter.setValue("text", "");

              // 0 timeout ensures the filter state is properly updated before resetting the queries
              setTimeout(refreshList, 0);
            }}
          />
          <View className="flex flex-row">
            <IconButton mode="contained" icon="tune" size={24} onPress={() => setIsEntryFilterOpen(true)} />
            <IconButton mode="contained" icon="download" size={24} onPress={() => setIsEntryExportOpen(true)} />
          </View>
        </View>
      </View>
    );
  }, [entryFilter, refreshList]);

  const renderItem = useCallback(
    ({ item }: { item: Entry }) => {
      return (
        <Pressable onPress={() => setSelectedEntry(item)}>
          <Surface style={{ borderRadius: theme.roundness }}>
            <View className="rounded-xl p-4 flex gap-2">
              <View className="flex flex-row items-center justify-between">
                <Text variant="titleMedium">{item.category?.name || "Sem categoria"}</Text>
                <Text
                  style={{
                    color: item.type === EntryTypes.Expense ? theme.colors.error : theme.colors.success,
                  }}
                >
                  {currencyFormatter.format(item.amount)}
                </Text>
              </View>
              <View className="flex flex-row items-center justify-between gap-4">
                <View style={{ flexShrink: 1 }}>
                  <Text variant="bodyMedium" ellipsizeMode="tail" numberOfLines={1}>
                    {item.description || "Sem descrição"}
                  </Text>
                </View>
                <Text variant="bodySmall">
                  {new Date(item.when).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "short",
                  })}
                </Text>
              </View>
            </View>
          </Surface>
        </Pressable>
      );
    },
    [theme.colors.error, theme.colors.success, theme.roundness],
  );

  useEffect(() => {
    const selectedCategory = categoryQuery.data?.data.find((category) => {
      return category.id === entryFilter.values.category;
    });

    if (!selectedCategory || (selectedCategory?.type as any) !== entryFilter.values.type) {
      entryFilter.setValue("category", undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryQuery.data?.data, entryFilter.values.type]);

  return (
    <TabbedLayout>
      <FlatList
        ListHeaderComponent={MemoizedListHeader}
        ListFooterComponent={
          <EndOfListWithLoading
            isLoading={entryQuery.isPending || entryQuery.isFetchingNextPage}
            endOfList={!entryQuery.isPending && !entryQuery.isFetchingNextPage && !entryQuery.hasNextPage}
            endOfListText="Não há mais lançamentos"
          />
        }
        contentContainerClassName="p-4"
        data={entries}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View className="h-4" />}
        onEndReached={() => entryQuery.fetchNextPage()}
        onEndReachedThreshold={1}
      />
      <AppFabOverlay>
        <FAB
          icon="plus"
          onPress={() => {
            entryForm.clear();

            setIsEntryFormOpen(true);
          }}
        />
      </AppFabOverlay>
      <AppFullScreenOverlay isOpen={isEntryFormOpen} onClose={() => setIsEntryFormOpen(false)}>
        <AppFullScreenOverlay.Header
          onBack={() => setIsEntryFormOpen(false)}
          title={!!entryForm.values.id ? "Editar lançamento" : "Novo lançamento"}
        />
        <View className="p-4 flex flex-col gap-2">
          <FormField className="mb-6">
            <SegmentedButtons
              value={entryForm.values.type}
              onValueChange={entryForm.makeSetter("type")}
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
              value={entryForm.values.category.id}
              onChange={(id) => entryForm.setValue("category", { id })}
              closeOnSelect
              options={
                categoryQuery.data?.data
                  .filter((category) => category.type === (entryForm.values.type as string))
                  .map((category) => {
                    return {
                      label: category.name,
                      value: category.id,
                    };
                  }) || []
              }
            />
            <HelperText type="error" visible={entryForm.hasError("category")}>
              {entryForm.getError("category")}
            </HelperText>
          </FormField>

          <View className="flex flex-row items-center gap-4">
            <FormField className="grow basis-0">
              <AppCurrencyInput
                mode="outlined"
                label="Valor"
                value={entryForm.values.amount}
                onChange={entryForm.makeSetter("amount")}
                error={entryForm.hasError("amount")}
              />
              <HelperText type="error" visible={entryForm.hasError("amount")}>
                {entryForm.getError("amount")}
              </HelperText>
            </FormField>

            <FormField className="grow basis-0">
              <AppDatePicker
                mode="outlined"
                label="Data"
                value={entryForm.values.when}
                onChange={entryForm.makeSetter("when")}
                error={entryForm.hasError("when")}
              />
              <HelperText type="error" visible={entryForm.hasError("when")}>
                {entryForm.getError("when")}
              </HelperText>
            </FormField>
          </View>

          <FormField>
            <TextInput
              mode="outlined"
              label="Descrição"
              value={entryForm.values.description}
              onChangeText={entryForm.makeSetter("description")}
              right={
                <TextInput.Affix
                  textStyle={{
                    color: entryForm.values.description.length > 60 ? theme.colors.error : theme.colors.onBackground,
                  }}
                  text={`${entryForm.values.description.length}/60`}
                />
              }
            />
            <HelperText type="error" visible={entryForm.hasError("description")}>
              {entryForm.getError("description")}
            </HelperText>
          </FormField>

          <Button
            mode="contained"
            onPress={() => entryCreateOrUpdateMutation.mutateAsync(entryForm.values)}
            loading={entryCreateOrUpdateMutation.isPending}
            disabled={entryCreateOrUpdateMutation.isPending || entryForm.hasErrors}
          >
            Pronto
          </Button>
        </View>
      </AppFullScreenOverlay>
      <AppBottomSheet isOpen={!!selectedEntry} onClose={() => setSelectedEntry(undefined)}>
        <Conditional
          if={!!selectedEntry}
          then={() => {
            return (
              <View className="flex flex-col gap-4">
                <View className="flex flex-row justify-between items-center gap-4">
                  <View style={{ flexShrink: 1 }}>
                    <Text variant="titleMedium" ellipsizeMode="tail" numberOfLines={1}>
                      {selectedEntry!.category?.name || "Sem categoria"}
                    </Text>
                  </View>
                  <View className="flex flex-row">
                    <IconButton
                      icon="content-copy"
                      iconColor={theme.colors.primary}
                      onPress={() => {
                        setIsEntryFormOpen(true);

                        entryForm.setForm({
                          id: undefined,
                          type: selectedEntry!.type,
                          category: {
                            id: selectedEntry!.category?.id || "",
                          },
                          amount: selectedEntry!.amount,
                          description: selectedEntry!.description,
                          when: new Date(selectedEntry!.when),
                        });
                      }}
                    />
                    <IconButton
                      icon="pencil"
                      iconColor={theme.colors.primary}
                      onPress={() => {
                        setIsEntryFormOpen(true);

                        entryForm.setForm({
                          id: selectedEntry!.id,
                          type: selectedEntry!.type,
                          category: {
                            id: selectedEntry!.category?.id || "",
                          },
                          amount: selectedEntry!.amount,
                          description: selectedEntry!.description,
                          when: new Date(selectedEntry!.when),
                        });
                      }}
                    />
                    <AppConfirmationDialog
                      trigger={({ open }) => {
                        return <IconButton icon="trash-can" iconColor={theme.colors.error} onPress={open} />;
                      }}
                      title="Remover lançamento?"
                      description="Tem certeza de que deseja remover este lançamento? Não será possível recuperá-lo."
                      confirmText="Tenho certeza"
                      onConfirm={async (close) => {
                        await entryDeleteMutation.mutateAsync(selectedEntry!);

                        close();
                      }}
                      confirmButtonProps={{
                        loading: entryDeleteMutation.isPending,
                        disabled: entryDeleteMutation.isPending,
                      }}
                      closeOnCancel
                    />
                  </View>
                </View>

                <Text variant="bodyMedium">{selectedEntry!.description || "Sem descrição"}</Text>
                <View className="flex flex-row justify-between items-center">
                  <Text
                    variant="bodyMedium"
                    style={{
                      color: selectedEntry!.type === EntryTypes.Expense ? theme.colors.error : theme.colors.success,
                    }}
                  >
                    {currencyFormatter.format(selectedEntry!.amount)}
                  </Text>
                  <Text>
                    {new Date(selectedEntry!.when).toLocaleString("pt-BR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </AppBottomSheet>
      <AppBottomSheet fullscreen isOpen={isEntryFilterOpen} onClose={() => {
				setIsEntryFilterOpen(false)
				console.log("changing state")
			}}>
        <View className="flex flex-col gap-4">
          <View className="flex flex-row items-center justify-between">
            <Text variant="headlineSmall">Filtros</Text>
            <Button
              mode="elevated"
              icon="close"
              onPress={() => {
                entryFilter.clear();
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
                  entryFilter.setValue("when", undefined);
                } else if (option === FilterDateOptions.Week) {
                  const endOfToday = new Date();
                  const startOfWeekAtMidnight = new Date();
                  const dayOfWeek = startOfWeekAtMidnight.getDay();
                  const daysToDecrement = !dayOfWeek ? 6 : dayOfWeek - 1;

                  startOfWeekAtMidnight.setDate(startOfWeekAtMidnight.getDate() - daysToDecrement);
                  startOfWeekAtMidnight.setHours(0, 0, 0, 0);
                  endOfToday.setHours(23, 59, 59, 999);

                  entryFilter.setValue("when", {
                    ge: startOfWeekAtMidnight,
                    le: endOfToday,
                  });
                } else if (option === FilterDateOptions.Month) {
                  const endOfToday = new Date();
                  const startOfMonthAtMidnight = new Date();

                  startOfMonthAtMidnight.setDate(1);
                  startOfMonthAtMidnight.setHours(0, 0, 0, 0);
                  endOfToday.setHours(23, 59, 59, 999);

                  entryFilter.setValue("when", {
                    ge: startOfMonthAtMidnight,
                    le: endOfToday,
                  });
                }
              }}
            />

            <Conditional
              if={filterDateOption === FilterDateOptions.Custom}
              then={() => {
                return (
                  <View className="mt-2 flex flex-row gap-4">
                    <AppDatePicker
                      containerClassName="grow basis-0"
                      mode="outlined"
                      label="Início"
                      value={entryFilter.values.when?.ge || new Date()}
                      onChange={(date) =>
                        entryFilter.setValue("when", {
                          ...entryFilter.values.when,
                          ge: date,
                        })
                      }
                    />
                    <AppDatePicker
                      containerClassName="grow basis-0"
                      mode="outlined"
                      label="Final"
                      value={entryFilter.values.when?.le || new Date()}
                      onChange={(date) =>
                        entryFilter.setValue("when", {
                          ...entryFilter.values.when,
                          le: date,
                        })
                      }
                    />
                  </View>
                );
              }}
            />
          </FormField>

          <FormField>
            <FormField.Label>Tipo de lançamento</FormField.Label>

            <AppChipSelect<IEntryFilter["type"]>
              value={entryFilter.values.type}
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
              onChange={entryFilter.makeSetter("type")}
            />
          </FormField>

          <FormField>
            <FormField.Label>Categoria</FormField.Label>

            <AppChipSelect<IEntryFilter["category"]>
              value={entryFilter.values.category}
              options={[
                {
                  value: undefined,
                  label: "Todas",
                },
                ...(categoryQuery.data?.data
                  .filter((category) => !entryFilter.values.type || entryFilter.values.type === (category.type as any))
                  .map((category) => {
                    return {
                      value: category.id,
                      label: category.name,
                    };
                  }) || []),
              ]}
              onChange={entryFilter.makeSetter("category")}
            />
          </FormField>

          <Button
            mode="contained"
            onPress={() => {
              setIsEntryFilterOpen(false);

              refreshList();
            }}
          >
            Aplicar
          </Button>
        </View>
      </AppBottomSheet>
      <Portal>
        <Dialog visible={isEntryExportOpen} onDismiss={() => setIsEntryExportOpen(false)}>
          <Dialog.Title>Exportar</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Deseja exportar seus lançamentos? A lista de exportação será gerada a partir dos filtros aplicados.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor={theme.colors.onSurfaceVariant} onPress={() => setIsEntryExportOpen(false)}>
              Cancelar
            </Button>
            <Button
              loading={entryExportMutation.isPending}
              disabled={entryExportMutation.isPending}
              onPress={() =>
                entryExportMutation.mutateAsync({
                  query: {
                    filter: entryFilter.values,
                  },
                })
              }
            >
              Exportar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </TabbedLayout>
  );
}
