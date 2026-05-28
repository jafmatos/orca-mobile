import { AppSecureStore } from "@/utils/AppSecureStore";
import zustand from "zustand";

type HideCurrencyStore = {
  isHidden: boolean;
  setIsHidden: (hidden: boolean) => void;
  toggle: () => void;
};

const getInitialHiddenState = (): boolean => {
  const stored = AppSecureStore.get("hide-currency");

	return stored === "true";
};

export const useHideCurrencyStore = zustand.create<HideCurrencyStore>((set) => ({
  isHidden: getInitialHiddenState(),
  setIsHidden: (hidden) => {
    AppSecureStore.save("hide-currency", String(hidden));
    set({ isHidden: hidden });
  },
  toggle: () => {
    set((state) => {
      const nextState = !state.isHidden;
      AppSecureStore.save("hide-currency", String(nextState));
      return { isHidden: nextState };
    });
  },
}));
