import { Conditional } from "@/components/Conditional";
import { EndOfListWithLoading } from "@/components/EndOfListWithLoading";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { AppConfirmationDialog } from "@/components/ui/AppConfirmationDialog";
import { AppCurrencyInput } from "@/components/ui/AppCurrencyInput";
import { AppDatePicker } from "@/components/ui/AppDatePicker";
import { AppFab } from "@/components/ui/AppFab";
import { AppFabOverlay } from "@/components/ui/AppFabOverlay";
import { AppFullScreenOverlay } from "@/components/ui/AppFullScreenOverlay";
import { AppIconButton } from "@/components/ui/AppIconButton";
import { AppSelect } from "@/components/ui/AppSelect";
import { FormField } from "@/components/ui/FormField";
import { useCategories } from "@/hooks/queries/use-categories";
import { useEntries } from "@/hooks/queries/use-entries";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { useAppToast } from "@/hooks/use-app-toast";
import { Entry, EntryTypes } from "@/models/Entry";
import {
	CreateEntryBody,
	CreateEntryReturnType,
	DeleteEntryReturnType,
	EntryService,
	UpdateEntryBody,
	UpdateEntryReturnType,
} from "@/services/EntryService";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { QueryKeys } from "@/utils/QueryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CopyIcon, EditIcon, PlusIcon, TrashIcon } from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Button, HelperText, Searchbar, SegmentedButtons, Surface, Text, TextInput, useTheme } from "react-native-paper";

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

  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | undefined>();

  const toast = useAppToast();
  const theme = useTheme();
  const themeColors = useAppThemeColors();
  const queryClient = useQueryClient();
  const categoryQuery = useCategories();
  const entryQuery = useEntries();
  const entryForm = useAppForm<IEntryForm>(initialFormValues);

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

      queryClient.resetQueries({
        queryKey: QueryKeys.Entry.getEntries(),
        exact: true,
      });
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

      queryClient.resetQueries({
        queryKey: QueryKeys.Entry.getEntries(),
        exact: true,
      });
    },
  });

  const entries = useMemo(() => {
    return entryQuery.data?.pages.map((page) => page.data).flat() || [];
  }, [entryQuery]);

  return (
    <TabbedLayout>
      <FlatList
        ListHeaderComponent={() => {
          return (
            <View className="flex flex-col gap-4">
              <View className="flex flex-row mb-4">
                <Searchbar style={{ flex: 1 }} value="" placeholder="Pesquisar" />
                {/* <IconButton mode="contained" icon="SlidersHorizontal" size={24} />
                <IconButton mode="contained" icon="Download" size={24} /> */}
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          <EndOfListWithLoading
            isLoading={entryQuery.isPending || entryQuery.isFetchingNextPage}
            endOfList={!entryQuery.isPending && !entryQuery.isFetchingNextPage && !entryQuery.hasNextPage}
            endOfListText="Não há mais lançamentos"
          />
        }
        contentContainerClassName="p-4"
        data={entries}
        renderItem={({ item }) => {
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
        }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        onEndReached={() => entryQuery.fetchNextPage()}
        onEndReachedThreshold={1}
      />
      <AppFabOverlay>
        <AppFab
          size="sm"
          text="Novo lançamento"
          icon={PlusIcon}
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
                  <Text ellipsizeMode="tail" numberOfLines={1}>
                    {selectedEntry!.category?.name || "Sem categoria"}
                  </Text>
                  <View className="flex flex-row gap-2">
                    <AppIconButton
                      onPress={() => {
                        setIsEntryFormOpen(true);

                        entryForm.setForm({
                          id: undefined,
                          type: selectedEntry!.type,
                          category: {
                            id: selectedEntry!.category.id,
                          },
                          amount: selectedEntry!.amount,
                          description: selectedEntry!.description,
                          when: new Date(selectedEntry!.when),
                        });
                      }}
                      as={CopyIcon}
                      color={themeColors["--color-info-500"]}
                    />
                    <AppIconButton
                      onPress={() => {
                        setIsEntryFormOpen(true);

                        entryForm.setForm({
                          id: selectedEntry!.id,
                          type: selectedEntry!.type,
                          category: {
                            id: selectedEntry!.category.id,
                          },
                          amount: selectedEntry!.amount,
                          description: selectedEntry!.description,
                          when: new Date(selectedEntry!.when),
                        });
                      }}
                      as={EditIcon}
                      color={themeColors["--color-warning-500"]}
                    />
                    <AppConfirmationDialog
                      trigger={({ open }) => {
                        return <AppIconButton onPress={open} as={TrashIcon} color={themeColors["--color-danger-500"]} />;
                      }}
                      title="Remover lançamento?"
                      description="Tem certeza de que deseja remover este lançamento? Não será possível recuperá-lo."
                      confirmText="Tenho certeza"
                      onConfirm={() => entryDeleteMutation.mutateAsync(selectedEntry!)}
                      confirmButtonProps={{
                        loading: entryDeleteMutation.isPending,
                        disabled: entryDeleteMutation.isPending,
                      }}
                    />
                  </View>
                </View>

                <Text>{selectedEntry!.description || "Sem descrição"}</Text>
                <View className="flex flex-row justify-between items-center">
                  <Text>{currencyFormatter.format(selectedEntry!.amount)}</Text>
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
    </TabbedLayout>
  );
}
