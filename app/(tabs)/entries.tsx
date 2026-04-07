import { AppFormField } from "@/components/AppFormField";
import { Conditional } from "@/components/Conditional";
import { EndOfListWithLoading } from "@/components/EndOfListWithLoading";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { AppButton } from "@/components/ui/AppButton";
import { AppConfirmationDialog } from "@/components/ui/AppConfirmationDialog";
import { AppCurrencyInput } from "@/components/ui/AppCurrencyInput";
import { AppDatePicker } from "@/components/ui/AppDatePicker";
import { AppFab } from "@/components/ui/AppFab";
import { AppFabOverlay } from "@/components/ui/AppFabOverlay";
import { AppFullScreenOverlay } from "@/components/ui/AppFullScreenOverlay";
import { AppIconButton } from "@/components/ui/AppIconButton";
import { AppSelect } from "@/components/ui/AppSelect";
import { AppToggleSelect } from "@/components/ui/AppToggleSelect";
import { SearchField } from "@/components/ui/SearchField";
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
import { Button, ButtonIcon, Text, View } from "@gluestack-ui/themed";
import { Portal } from "@gorhom/portal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CopyIcon, DownloadIcon, EditIcon, PlusIcon, SlidersHorizontalIcon, TrashIcon } from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, Pressable } from "react-native";

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
              <View className="flex flex-row gap-4 mb-4">
                <SearchField
                  onSearch={(text) => console.log(text)}
                  containerProps={{
                    height: "100%",
                    className: "grow",
                  }}
                />
                <Button className="aspect-square" variant="outline">
                  <ButtonIcon color="$primary500" as={SlidersHorizontalIcon} />
                </Button>
                <Button className="aspect-square" variant="outline">
                  <ButtonIcon color="$primary500" as={DownloadIcon} />
                </Button>
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
            <Pressable
              key={item.id}
              onPress={() => {
                setSelectedEntry(item);
              }}
            >
              <View className="p-4 rounded-lg flex flex-col gap-2" backgroundColor="$background800">
                <View className="flex flex-row justify-between items-center">
                  <Text fontSize={16} fontWeight={600} color="$typography0">
                    {item.category.name || "Sem categoria"}
                  </Text>
                  <Text
                    fontSize={14}
                    fontWeight={500}
                    color={item.type === EntryTypes.Income ? themeColors["--color-success-500"] : themeColors["--color-danger-500"]}
                  >
                    {currencyFormatter.format(item.amount)}
                  </Text>
                </View>
                <View className="flex flex-row justify-between items-center gap-4">
                  <Text fontSize={16} fontWeight={400} color="$typography400" ellipsizeMode="tail" numberOfLines={1} flex={1}>
                    {item.description || "Sem descrição"}
                  </Text>
                  <Text fontSize={13} fontWeight={500} color="$typography400">
                    {new Date(item.when).toLocaleString("pt-BR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Text>
                </View>
              </View>
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
          <AppToggleSelect<EntryTypes>
            value={entryForm.values.type}
            options={[
              {
                label: "Despesa",
                value: EntryTypes.Expense,
              },
              {
                label: "Receita",
                value: EntryTypes.Income,
              },
            ]}
            onChange={entryForm.makeSetter("type")}
          />
          <AppFormField>
            <AppFormField.Label>Categoria</AppFormField.Label>
            <AppSelect
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
          </AppFormField>
          <AppFormField isRequired isInvalid={entryForm.hasError("amount")}>
            <AppFormField.Label>Valor</AppFormField.Label>
            <AppCurrencyInput value={entryForm.values.amount} placeholder="R$ 7,90" onChange={entryForm.makeSetter("amount")} />
            <AppFormField.Error error={entryForm.getError("amount")} />
          </AppFormField>
          <AppFormField isInvalid={entryForm.hasError("description")}>
            <AppFormField.Label>Descrição</AppFormField.Label>
            <AppFormField.TextInput
              value={entryForm.values.description}
              placeholder="Descrição"
              onChangeText={entryForm.makeSetter("description")}
            />
            <AppFormField.Error error={entryForm.getError("description")} />
            <AppFormField.HelperText
              text={`${entryForm.values.description.length}/60`}
              color={entryForm.values.description.length > 60 ? "$danger500" : undefined}
            />
          </AppFormField>
          <View className="flex flex-row columns-2 gap-4">
            <AppFormField className="grow basis-0" isRequired isInvalid={entryForm.hasError("when")}>
              <AppFormField.Label>Data</AppFormField.Label>
              <AppDatePicker value={entryForm.values.when} onChange={entryForm.makeSetter("when")} />
              <AppFormField.Error error={entryForm.getError("when")} />
            </AppFormField>
          </View>
          <AppButton
            text="Pronto"
            className="mt-6"
            onPress={() => entryCreateOrUpdateMutation.mutateAsync(entryForm.values)}
            loading={entryCreateOrUpdateMutation.isPending}
            disabled={entryCreateOrUpdateMutation.isPending || entryForm.hasErrors}
            color="primary"
          />
        </View>
      </AppFullScreenOverlay>
      <AppBottomSheet isOpen={!!selectedEntry} onClose={() => setSelectedEntry(undefined)}>
        <Conditional
          if={!!selectedEntry}
          then={() => {
            return (
              <View className="flex flex-col gap-4">
                <View className="flex flex-row justify-between items-center gap-4">
                  <Text fontWeight={600} fontSize={18} color="$typography0" ellipsizeMode="tail" numberOfLines={1}>
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

                <Text color="$typography200">{selectedEntry!.description || "Sem descrição"}</Text>
                <View className="flex flex-row justify-between items-center">
                  <Text fontWeight={500} color={selectedEntry!.type === EntryTypes.Income ? "$success500" : "$danger500"}>
                    {currencyFormatter.format(selectedEntry!.amount)}
                  </Text>
                  <Text fontSize={14} fontWeight={600} color="$typography400">
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
