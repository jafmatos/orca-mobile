import { $axios } from "@/utils/$axios";

export enum CreateBillingPortalUIMode {
  Hosted = "hosted",
  Embedded = "embedded",
}

export type CreateBillingPortalUrlBody = {
  ui_mode: CreateBillingPortalUIMode;
  returnUrl?: string;
};

export type CreateBillingPortalUrlReturnType = {
  session: {
    url: string;
  } & Record<string, unknown>;
};

export class BillingPortalApiService {
  private static readonly path = "/stripe/billing-portals";

  static async createUrl(body: CreateBillingPortalUrlBody): Promise<CreateBillingPortalUrlReturnType> {
    const { data } = await $axios.post<CreateBillingPortalUrlReturnType>(`${this.path}`, body);

    return data;
  }
}
