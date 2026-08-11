export class UserQueryKeys {
  private static readonly baseKey = "users";

  public static getAuthUser() {
    return [this.baseKey, "authenticated"];
  }
}

export class EntryQueryKeys {
  private static readonly baseKey = "entries";

  public static getEntries(filter?: any) {
    return filter && Object.keys(filter).length > 0 ? [this.baseKey, "list", filter] : [this.baseKey, "list"];
  }

  public static getEntriesFiltered(queryKey: readonly unknown[]) {
    const baseListKey = this.getEntries();

    return queryKey[0] === baseListKey[0] && queryKey[1] === baseListKey[1] && queryKey.length > baseListKey.length;
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

  public static all() {
    return [this.baseKey];
  }

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

export class ScheduleQueryKeys {
  private static readonly baseKey = "schedules";

  public static getSchedules() {
    return [this.baseKey, "list"];
  }
}

export class AnalysisQueryKeys {
  private static readonly baseKey = "analyses";

  public static getAnalyses() {
    return [this.baseKey, "list"];
  }
}

export class ChatQueryKeys {
  private static readonly baseKey = "chats";

  public static getMessages() {
    return [this.baseKey, "messages"];
  }
}

export class QueryKeys {
  public static readonly User = UserQueryKeys;
  public static readonly Entry = EntryQueryKeys;
  public static readonly Category = CategoryQueryKeys;
  public static readonly Overview = OverviewQueryKeys;
  public static readonly Schedule = ScheduleQueryKeys;
  public static readonly Analysis = AnalysisQueryKeys;
  public static readonly Chat = ChatQueryKeys;
}
