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
  setValue: <Key extends keyof Form>(key: Key, value: Form[Key]) => Form;
  setForm: (form: Form) => Form;
  makeSetter: <Key extends keyof Form>(key: Key) => (value: Form[Key]) => void;
  clear: () => void;
};

export const useAppForm = <Form>(initialState: Form): AppForm<Form> => {
  const [form, setForm] = useState<Form>(initialState);
  const [errors, setErrors] = useState<AppFormErrors<Form>>([]);

  const makeSetter = <Key extends keyof Form>(key: Key) => {
    return (value: Form[Key]) => {
      setForm({
        ...form,
        [key]: value,
      });
      setErrors(errors.filter((error) => error.path !== key));
    };
  };

  const setValue = <Key extends keyof Form>(key: Key, value: Form[Key]) => {
    const newForm = {
      ...form,
      [key]: value,
    };
    setForm(newForm);
    setErrors(errors.filter((error) => error.path !== key));

    return newForm;
  };

  const _setForm = (form: Form) => {
    setForm(form);

    return form;
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
    makeSetter,
    setValue,
    setForm: _setForm,
    setErrors,
    getError,
    hasError,
    clear,
  };
};
