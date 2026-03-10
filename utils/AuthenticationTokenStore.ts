import { AppSecureStore } from "./AppSecureStore";

export class AppAuthenticationTokenStore {
  private static readonly key = "authentication-token";

  public static get(): string | null {
    const colorScheme = AppSecureStore.get(this.key);

    return colorScheme;
  }

  public static set(authenticationToken: string) {
    return AppSecureStore.save(this.key, authenticationToken);
  }

  public static remove() {
    return AppSecureStore.removeAsync(this.key);
  }
}
