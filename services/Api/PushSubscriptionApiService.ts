import { $axios } from "@/utils/$axios";
import { PushSubscription, PushSubscriptionProvider } from "@/models/PushSubscription";

export interface CreateWebPushSubscriptionArguments {
  provider: PushSubscriptionProvider.Webpush;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  platform?: string;
}

export interface CreateExpoPushSubscriptionArguments {
  provider: PushSubscriptionProvider.Expo;
  expoPushToken: string;
  platform?: string;
}


export type CreatePushSubscriptionArguments = CreateExpoPushSubscriptionArguments | CreateWebPushSubscriptionArguments;

export class PushSubscriptionService {
  private static readonly endpoint = "/push-subscriptions";

  private static async _create(body: CreatePushSubscriptionArguments): Promise<PushSubscription> {
    const { data } = await $axios.post(this.endpoint, body);

    return data;
  }

  private static async _remove(params: { expoPushToken: string; provider: PushSubscriptionProvider }): Promise<void> {
    await $axios.delete(this.endpoint, { params });
  }

  public static create = PushSubscriptionService._create.bind(PushSubscriptionService);
  public static remove = PushSubscriptionService._remove.bind(PushSubscriptionService);
}
