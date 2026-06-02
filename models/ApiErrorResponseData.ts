import { ApiValidationError } from "./ApiValidationError";

export interface ApiErrorResponseData {
  message: string;
  errors?: ApiValidationError[];
}