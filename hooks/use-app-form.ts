import { ApiValidationError } from "@/models/ApiValidationError";
import { useCallback, useRef, useState } from "react";

export type AppFormErrors<Form> = (Omit<ApiValidationError, "path"> & { path: keyof Form })[];

export type AppForm<Form, Metadata = any> = {
  values: Form;
  metadata?: Metadata;
  errors: AppFormErrors<Form>;
  error?: string;
  hasErrors: boolean;
  getError: (key: keyof Form) => string | undefined;
  hasError: (key: keyof Form) => boolean;
  setErrors: React.Dispatch<React.SetStateAction<AppFormErrors<Form>>>;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
  setValue: <Key extends keyof Form>(key: Key, value: Form[Key]) => Form;
  setForm: (form: Form) => Form;
  setMetadata: React.Dispatch<React.SetStateAction<Metadata | undefined>>;
  makeSetter: <Key extends keyof Form>(key: Key) => (value: Form[Key]) => void;
  clear: () => void;
};

export const useAppForm = <Form, Metadata = any>(initialState: Form, _metadata?: Metadata): AppForm<Form, Metadata> => {
  const [form, setForm] = useState<Form>(initialState);
  const [metadata, setMetadata] = useState<Metadata | undefined>(_metadata);
  const [errors, setErrors] = useState<AppFormErrors<Form>>([]);
  const [error, setError] = useState<string | undefined>(undefined);

  const settersRef = useRef<{ [key in keyof Form]?: (value: any) => void }>({});

  const makeSetter = useCallback(<Key extends keyof Form>(key: Key) => {
    if (!settersRef.current[key]) {
      settersRef.current[key] = (value: Form[Key]) => {
        setForm((prev) => ({
          ...prev,
          [key]: value,
        }));
        setErrors((prevErrors) => prevErrors.filter((error) => error.path !== key));
        setError(undefined);
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
      setError(undefined);

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
    setError(undefined);
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
    metadata: metadata,
    errors: errors,
    error: error,
    hasErrors: !!errors.length,
    makeSetter,
    setValue,
    setForm: _setForm,
    setErrors,
    setError,
    setMetadata,
    getError,
    hasError,
    clear,
  };
};
