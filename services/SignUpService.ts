import { User } from "@/models/User";
import { UserKey } from "@/models/UserKey";
import { $axios } from "@/utils/$axios";

export type CreateSignUpKeyArguments = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  acceptedTerms: boolean;
  confirmUrl: string;
};

export type CreateSignUpKeyReturnType = {
  key: UserKey;
  confirmUrl: string;
};

export type ConfirmSignUpArguments = {
  otp: string;
};

export type ConfirmSignUpReturnType = {
  user: User;
  token: string;
};

export class SignUpService {
  private static readonly endpoint = "/sign-up";

  public static async createSignUpKey(body: CreateSignUpKeyArguments): Promise<CreateSignUpKeyReturnType> {
    const { data } = await $axios.post(this.endpoint, body);

    return data;
  }

  public static async confirmSignUp(keyId: string, body: ConfirmSignUpArguments): Promise<ConfirmSignUpReturnType> {
    const { data } = await $axios.put(`${this.endpoint}/${keyId}`, body);

    return data;
  }
}
