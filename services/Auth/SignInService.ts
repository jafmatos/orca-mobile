import { User } from "@/models/User";
import { $axios } from "@/utils/$axios";

export type CreateAuthenticationTokenArguments = {
  email: string;
  password: string;
};

export type CreateAuthenticationTokenReturnType = {
  token: string;
  user: User;
};

export type GetProfileReturnType = {
  user: User;
};

export class SignInService {
  private static readonly endpoint = "/sign-in";

  private static async _createAuthenticationToken(body: CreateAuthenticationTokenArguments): Promise<CreateAuthenticationTokenReturnType> {
    const { data } = await $axios.post(this.endpoint, body);

    return data;
  }

  private static async _getProfile(): Promise<GetProfileReturnType> {
    const { data } = await $axios.get(this.endpoint);

    console.log("Getting profile");

    return data;
  }

  public static createAuthenticationToken = SignInService._createAuthenticationToken.bind(SignInService);
  public static getProfile = SignInService._getProfile.bind(SignInService);
}
