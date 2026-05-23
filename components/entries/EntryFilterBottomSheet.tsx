import { BottomSheetRef } from "jam-bottomsheet";
import React, { useImperativeHandle, useMemo } from "react";
import { AppBottomSheet } from "../ui/AppBottomSheet";
import { ListEntriesArguments } from "@/services/EntryService";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { FormField } from "../ui/FormField";
import { AppChipSelect } from "../ui/AppChipSelect";
import { AppDatePicker } from "../ui/AppDatePicker";
import { EntryTypes } from "@/models/Entry";
import { useAppForm } from "@/hooks/use-app-form";
import { useCategories } from "@/hooks/queries/use-categories";

enum FilterDateOptions {
  Period = "period",
  Week = "week",
  Month = "month",
  Custom = "custom",
}

export type EntryFilterForm = Required<Required<ListEntriesArguments>["query"]>["filter"];

export interface EntryFilterBottomSheetProps {
  onFilterChange: (filter: EntryFilterForm) => void;
}

export interface EntryFilterBottomSheetRef extends BottomSheetRef {}

export const EntryFilterBottomSheet = React.forwardRef<EntryFilterBottomSheetRef, EntryFilterBottomSheetProps>(
  function EntryFilterBottomSheet(props, ref) {
    const categoriesQuery = useCategories();
    const [filterDateOption, setFilterDateOption] = React.useState<FilterDateOptions>(FilterDateOptions.Period);

    const bottomSheetRef = React.useRef<BottomSheetRef>(null);

    const openBottomSheet = () => bottomSheetRef.current?.open();
    const closeBottomSheet = () => bottomSheetRef.current?.close();

    const filterForm = useAppForm<EntryFilterForm>({
      category: undefined,
      text: "",
      type: undefined,
      when: undefined,
    });

    useImperativeHandle(ref, () => {
      return {
        open: openBottomSheet,
        close: closeBottomSheet,
      };
    }, []);

    const categories = useMemo(() => {
      return (
        categoriesQuery.data?.data.filter((category) => (category.type as string) === filterForm.values.type || !filterForm.values.type) ||
        []
      );
    }, [categoriesQuery.data, filterForm.values.type]);

    return (
      <AppBottomSheet imperative fullscreen ref={bottomSheetRef}>
        <View className="flex flex-col gap-4">
          <View className="flex flex-row items-center justify-between">
            <Text variant="headlineSmall">Filtros</Text>
            <Button
              mode="elevated"
              icon="close"
              onPress={() => {
                setFilterDateOption(FilterDateOptions.Period);
                filterForm.clear();
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
                ...(categories.map((category) => {
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
              closeBottomSheet();
            }}
          >
            Aplicar
          </Button>
        </View>
      </AppBottomSheet>
    );
  },
);
