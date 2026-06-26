import { $axios } from "@/utils/$axios";
import { User } from "@/models/User";

export class SubscriptionApiService {
  private static readonly endpoint = "/subscriptions";

  private static async _cancel(): Promise<{ user: User }> {
    const { data } = await $axios.post(`${this.endpoint}/cancel`);
    return data;
  }

  public static cancel = SubscriptionApiService._cancel.bind(SubscriptionApiService);
}
