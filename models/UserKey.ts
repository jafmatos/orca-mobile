export enum UserKeyTypes {
  SignUp = "sign-up",
  ResetPassword = "reset-password",
}

export interface UserKey {
  id: string;
  type: UserKeyTypes;
  expiresAt: Date;
}
