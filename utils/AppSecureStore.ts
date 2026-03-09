import * as SecureStore from "expo-secure-store";

export class AppSecureStore {
  public static save(key: string, value: string) {
    SecureStore.setItem(key, value);
  }

  public static saveAsync(key: string, value: string) {
    SecureStore.setItemAsync(key, value);
  }

  public static get(key: string) {
    return SecureStore.getItem(key);
  }

  public static getAsync(key: string) {
    return SecureStore.getItemAsync(key);
  }

  public static async removeAsync(key: string) {
    return await SecureStore.deleteItemAsync(key);
  }
}
