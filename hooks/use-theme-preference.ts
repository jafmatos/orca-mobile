import { AppSecureStore } from "@/utils/AppSecureStore";
import zustand from "zustand";

export type ThemePreference = "light" | "dark" | "system";

type ThemeStore = {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
};

const getInitialPreference = (): ThemePreference => {
  const stored = AppSecureStore.get("theme-preference");
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored as ThemePreference;
  }
  return "system";
};

export const useThemePreference = zustand.create<ThemeStore>((set) => ({
  preference: getInitialPreference(),
  setPreference: (pref) => {
    AppSecureStore.save("theme-preference", pref);
    set({ preference: pref });
  },
}));
