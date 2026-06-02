import { ApiValidationError } from "@/models/ApiValidationError";
import { useCallback, useRef, useState } from "react";

export type AppFormErrors<Form> = (Omit<ApiValidationError, "path"> & { path: keyof Form })[];

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

  const settersRef = useRef<{ [key in keyof Form]?: (value: any) => void }>({});

  const makeSetter = useCallback(<Key extends keyof Form>(key: Key) => {
    if (!settersRef.current[key]) {
      settersRef.current[key] = (value: Form[Key]) => {
        setForm((prev) => ({
          ...prev,
          [key]: value,
        }));
        setErrors((prevErrors) => prevErrors.filter((error) => error.path !== key));
      };
    }
    return settersRef.current[key] as (value: Form[Key]) => void;
  }, []);

  const setValue = useCallback(
    <Key extends keyof Form>(key: Key, value: Form[Key]) => {
      const newForm = {
        ...form,
        [key]: value,
      };
      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));
      setErrors((prevErrors) => prevErrors.filter((error) => error.path !== key));

      return newForm;
    },
    [form],
  );

  const _setForm = useCallback((form: Form) => {
    setForm(form);

    return form;
  }, []);

  const clear = useCallback(() => {
    setForm(initialState);
    setErrors([]);
  }, [initialState]);

  const getError = useCallback(
    (key: keyof Form) => {
      const error = errors.find((error) => error.path === key);

      return error?.message;
    },
    [errors],
  );

  const hasError = useCallback(
    (key: keyof Form) => {
      return errors.some((error) => error.path === key);
    },
    [errors],
  );

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
