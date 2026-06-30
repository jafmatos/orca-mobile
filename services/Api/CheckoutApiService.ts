import { $axios } from "@/utils/$axios";

export enum CreateCheckoutUIMode {
  Hosted = "hosted",
  Embedded = "embedded",
}

export type CreateCheckoutUrlBody = {
  ui_mode: CreateCheckoutUIMode;
  success_url?: string;
  cancel_url?: string;
  return_url?: string;
  redirect_on_completion?: "always" | "never";
  planId: string;
};

export type CreateCheckoutUrlReturnType = {
  session: {
    url: string;
  } & Record<string, unknown>;
};

export class CheckoutApiService {
  private static readonly path = "/stripe/checkout";

  static async createUrl(body: CreateCheckoutUrlBody): Promise<CreateCheckoutUrlReturnType> {
    const { data } = await $axios.post<CreateCheckoutUrlReturnType>(`${this.path}`, body);

    return data;
  }
}
