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

export class OverviewQueryKeys {
  private static readonly baseKey = "overview";

  public static getExpenseByCategory(options?: any) {
    return [this.baseKey, "expense-by-category", options];
  }

  public static getMonthlyEvolution(options?: any) {
    return [this.baseKey, "monthly-evolution", options];
  }

  public static getKpis(options?: any) {
    return [this.baseKey, "kpis", options];
  }
}

export class QueryKeys {
  public static readonly User = UserQueryKeys;
  public static readonly Entry = EntryQueryKeys;
  public static readonly Category = CategoryQueryKeys;
  public static readonly Overview = OverviewQueryKeys;
}
