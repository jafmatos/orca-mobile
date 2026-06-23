import { ApiErrorResponseData } from "@/models/ApiErrorResponseData";

export const isApiValidationError = (err: ApiErrorResponseData): err is ApiErrorResponseData => {
  if (!Object.keys(err).includes("errors")) return false;
  if (!Array.isArray(err.errors)) return false;
  if (err.errors.some((error) => typeof error.path !== "string" || typeof error.message !== "string")) return false;

  return true;
};
