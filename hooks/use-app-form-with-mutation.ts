import { ApiValidationError } from "@/models/ApiValidationError";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { AppForm } from "./use-app-form";
import { useAppToast } from "./use-app-toast";
import { isApiValidationError } from "@/utils/isApiValidationError";

export interface AppMutationOptions<TData, TError, TVariables> extends UseMutationOptions<TData, TError, TVariables> {
  toastOffset?: number;
}

export const useAppFormWithMutation = <
  Form,
  TVariables = unknown,
  TData = unknown,
  TError = AxiosError<Error & { errors?: ApiValidationError[] }>,
>(
  appForm: AppForm<Form>,
  mutationConfig: AppMutationOptions<TData, TError, TVariables>
) => {
  const toast = useAppToast();
  const mutation = useMutation<TData, TError, TVariables>({
    ...mutationConfig,
    onError: (err, variables, onMutateResult, context) => {
      mutationConfig.onError && mutationConfig.onError(err, variables, onMutateResult, context);

      if (!isAxiosError(err)) {
        console.log(err);

        return;
      }

      if (err.response?.status === 422 && isApiValidationError(err.response?.data)) {
        appForm.setErrors((err.response.data.errors || []) as any);
        appForm.setError(err.response.data.message);

        return;
      }

      toast.error({
        title: "Ops...",
        description: err.response?.data.message || "Erro desconhecido",
        topOffset: mutationConfig.toastOffset,
      });
    },
  });

  return {
    ...appForm,
    mutation,
  };
};
