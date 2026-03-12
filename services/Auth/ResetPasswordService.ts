import { User } from "@/models/User";
import { UserKey } from "@/models/UserKey";
import { $axios } from "@/utils/$axios";

export type CreateResetPasswordKeyArguments = {
  email: string;
  confirmUrl: string;
};

export type CreateResetPasswordKeyReturnType = {
  key: UserKey;
  confirmUrl: string;
};

export type ConfirmResetPasswordArguments = {
  otp: string;
  password: string;
  passwordConfirmation: string;
};

export type ConfirmResetPasswordReturnType = {
  user: User;
  token: string;
};

export class ResetPasswordService {
  private static readonly endpoint = "/reset-password";

  private static async _createResetPasswordKey(body: CreateResetPasswordKeyArguments): Promise<CreateResetPasswordKeyReturnType> {
    const { data } = await $axios.post(this.endpoint, body);

    return data;
  }

  private static async _confirmResetPassword(keyId: string, body: ConfirmResetPasswordArguments): Promise<ConfirmResetPasswordReturnType> {
    const { data } = await $axios.put(`${this.endpoint}/${keyId}`, body);

    return data;
  }

  public static createResetPasswordKey = ResetPasswordService._createResetPasswordKey.bind(ResetPasswordService);
  public static confirmResetPassword = ResetPasswordService._confirmResetPassword.bind(ResetPasswordService);
}
