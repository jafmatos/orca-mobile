export enum PushSubscriptionProvider {
  Webpush = "webpush",
  Expo = "expo",
}

export interface PushSubscription {
  id: string;
  provider: PushSubscriptionProvider;
  expoPushToken: string;
  platform: string;
  createdAt: string;
  updatedAt: string;
}
