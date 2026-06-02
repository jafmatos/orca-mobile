import { ListEntriesArguments } from "@/services/Api/EntryApiService";
import zustand from "zustand";

type EntryQuery = NonNullable<ListEntriesArguments["query"]>;

type EntryQueryStore = {
  filter: EntryQuery["filter"];
  order: EntryQuery["order"];
  setFilter: (filter: EntryQuery["filter"]) => void;
  setOrder: (order: EntryQuery["order"]) => void;
  setFilterProp: <K extends keyof EntryQuery["filter"]>(key: K, value: EntryQuery["filter"][K]) => void;
  setOrderProp: <K extends keyof EntryQuery["order"]>(key: K, value: EntryQuery["order"][K]) => void;
  clearFilter: () => void;
  clearOrder: () => void;
  clearParams: () => void;
};

const initialFilter: EntryQuery["filter"] = {
  text: "",
  category: undefined,
  type: undefined,
  when: undefined,
};

const initialOrder: EntryQuery["order"] = {
  entity: "entry",
  column: "when",
  mode: "DESC",
};

export const useEntryQueryParams = zustand.create<EntryQueryStore>((set, get) => ({
  filter: initialFilter,
  order: initialOrder,
  setFilter: (filter) => set({ filter }),
  setOrder: (order) => set({ order }),
  setFilterProp: (key, value) =>
    set((state) => ({
      filter: { ...state.filter, [key]: value },
    })),
  setOrderProp: (key, value) =>
    set((state) => ({
      order: { ...state.order, [key]: value },
    })),
  clearFilter: () => set({ filter: initialFilter }),
  clearOrder: () => set({ order: initialOrder }),
  clearParams: () => set({ filter: initialFilter, order: initialOrder }),
}));
