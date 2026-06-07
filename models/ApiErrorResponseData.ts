import { ApiValidationError } from "./ApiValidationError";

export class ApiErrorResponseData {
  message!: string;
  errors?: ApiValidationError[];
}