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

export class AuthenticationService {
  private static readonly endpoint = "/sign-in";

  public static async createAuthenticationToken(body: CreateAuthenticationTokenArguments): Promise<CreateAuthenticationTokenReturnType> {
    const { data } = await $axios.post(this.endpoint, body);

    return data;
  }
}
