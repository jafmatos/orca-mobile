import { AppSecureStore } from "./AppSecureStore";

type AppThemeName = "dark" | "light" | "system";

export class AppThemeNameStore {
  private static readonly key = "color-scheme";

  public static get(): AppThemeName | null {
    const colorScheme = AppSecureStore.get(this.key);

    return colorScheme as AppThemeName | null;
  }

  public static set(colorScheme: AppThemeName) {
    return AppSecureStore.save(this.key, colorScheme);
  }

  public static remove() {
    return AppSecureStore.removeAsync(this.key);
  }
}
