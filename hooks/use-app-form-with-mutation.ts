import { ApiValidationError } from "@/models/ApiValidationError";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { AppForm } from "./use-app-form";
import { useAppToast } from "./use-app-toast";
import { ApiErrorResponseData } from "@/models/ApiErrorResponseData";

export const useAppFormWithMutation = <
  Form,
  TVariables = unknown,
  TData = unknown,
  TError = AxiosError<Error & { errors?: ApiValidationError[] }>,
>(
  appForm: AppForm<Form>,
  mutationConfig: UseMutationOptions<TData, TError, TVariables>,
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

      if (err.response?.status === 422 && err.response.data instanceof ApiErrorResponseData) {
        appForm.setErrors((err.response.data.errors || []) as any);

        return;
      }

      toast.error({
        title: "Ops...",
        description: err.response?.data.message || "Erro desconhecido",
      });
    },
  });

  return {
    ...appForm,
    mutation,
  };
};
