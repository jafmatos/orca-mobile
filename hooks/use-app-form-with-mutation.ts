import { ApiError } from "@/models/ApiError";
import { AxiosError } from "axios";
import { AppForm } from "./use-app-form";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useAppToast } from "./use-app-toast";

export const useAppFormWithMutation = <Form, TVariables = unknown, TData = unknown, TError = AxiosError<Error & { errors?: ApiError[] }>>(
  appForm: AppForm<Form>,
  mutationConfig: UseMutationOptions<TData, TError, TVariables>,
) => {
  const toast = useAppToast();
  const mutation = useMutation<TData, TError, TVariables>({
    ...mutationConfig,
    onError: (err, variables, onMutateResult, context) => {
      mutationConfig.onError && mutationConfig.onError(err, variables, onMutateResult, context);

      const error = err as AxiosError<Error & { errors?: ApiError[] }>;

			if (error.response?.status === 422) {
        appForm.setErrors((error.response?.data?.errors || []) as any);

        return;
      }

      toast.error({
        title: "Ops...",
        description: error.response?.data?.message || "Erro desconhecido",
      });
    },
  });

  return {
    ...appForm,
    mutation,
  };
};
