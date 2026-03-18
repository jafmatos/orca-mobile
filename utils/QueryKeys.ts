export class UserQueryKeys {
  private static readonly baseKey = "users";

  public static getAuthUser() {
    return [this.baseKey, "authenticated"];
  }
}

export class EntryQueryKeys {
  private static readonly baseKey = "entries";

  public static getEntries() {
    return [this.baseKey, "list"];
  }
}

export class CategoryQueryKeys {
  private static readonly baseKey = "categories";

  public static getCategories() {
    return [this.baseKey, "list"];
  }
}

export class QueryKeys {
  public static readonly User = UserQueryKeys;
  public static readonly Entry = EntryQueryKeys;
  public static readonly Category = CategoryQueryKeys;
}
