import { ApiError } from "@/models/ApiError";
import { useState } from "react";

export type AppFormErrors<Form> = (Omit<ApiError, "path"> & { path: keyof Form })[];

export type AppForm<Form> = {
  values: Form;
  errors: AppFormErrors<Form>;
  hasErrors: boolean;
  getError: (key: keyof Form) => string | undefined;
  hasError: (key: keyof Form) => boolean;
  setErrors: React.Dispatch<React.SetStateAction<AppFormErrors<Form>>>;
  setValue: <Key extends keyof Form>(key: Key, value: Form[Key]) => void;
  clear: () => void;
};

export const useAppForm = <Form>(initialState: Form): AppForm<Form> => {
  const [form, setForm] = useState<Form>(initialState);
  const [errors, setErrors] = useState<AppFormErrors<Form>>([]);

  const setValue = <Key extends keyof Form>(key: Key, value: Form[Key]) => {
    setForm({
      ...form,
      [key]: value,
    });
    setErrors(errors.filter((error) => error.path !== key));
  };

  const clear = () => {
    setForm(initialState);
    setErrors([]);
  };

  const getError = (key: keyof Form) => {
    const error = errors.find((error) => error.path === key);

    return error?.message;
  };

  const hasError = (key: keyof Form) => {
    return errors.some((error) => error.path === key);
  };

  return {
    values: form,
    errors: errors,
    hasErrors: !!errors.length,
    setValue,
    setErrors,
    getError,
    hasError,
    clear,
  };
};
