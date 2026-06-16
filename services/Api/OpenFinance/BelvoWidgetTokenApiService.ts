import { $axios } from "@/utils/$axios";

export interface CreateBelvoWidgetTokenBody {
  stale_in: string;
  widget: {
    openfinance_feature?: string;
    callback_urls?: {
      application_link?: string;
      success?: string;
      exit?: string;
      event?: string;
    };
    branding?: {
      company_icon?: string;
      company_logo?: string;
      company_name?: string;
      overlay_background_color?: string;
      social_proof?: boolean;
      show_belvo_middle_logo?: boolean;
    };
    theme?: {
      css_key: string;
      value: string;
    }[];
    consent?: {
      purpose?: string;
      terms_and_conditions_url?: string;
      permissions?: string[];
      default_consent_duration_days?: number;
      identification_info?: {
        type: "CPF" | "CNPJ";
        number: string;
        name: string;
      }[];
    };
  };
}

export interface CreateBelvoWidgetTokenReturnType {
  access: string;
  refresh: string;
}

export class BelvoWidgetTokenApiService {
  private static readonly path = "/belvo/widget-token";

  private static async _create(body: CreateBelvoWidgetTokenBody): Promise<CreateBelvoWidgetTokenReturnType> {
    const { data } = await $axios.post(this.path, body);

    return data;
  }

  public static readonly create = BelvoWidgetTokenApiService._create.bind(BelvoWidgetTokenApiService);
}
