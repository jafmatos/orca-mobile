import { useAppForm } from "@/hooks/use-app-form";
import { Entry, EntryTypes } from "@/models/Entry";
import React, { useEffect, useMemo } from "react";
import { EntryCreateOrUpdateForm, EntryForm } from "./EntryForm";
import { z } from "zod";

const entryDraftSchema = z.object({
  id: z.string().optional(),
  type: z.enum(EntryTypes),
  amount: z.number("Informe um valor").min(0.01, "Valor mínimo: R$ 0,01"),
  description: z.string().max(60, "A descrição deve ter no máximo 60 caracteres").optional().nullable(),
  when: z.date("Informe uma data"),
  category: z.object({ id: z.string() }).optional(),
});

export interface EntryDraftFormProps {
  draft: Entry;
  onSubmit: (draft: EntryCreateOrUpdateForm) => void;
  onDelete?: (draft: EntryCreateOrUpdateForm) => void;
  onBackPress?: () => void;
  errors?: Partial<Record<keyof EntryCreateOrUpdateForm, string>>;
}

export function EntryDraftForm(props: EntryDraftFormProps) {
  const form = useAppForm<EntryCreateOrUpdateForm>({
    type: EntryTypes.Expense,
    category: {
      id: "",
    },
    amount: 0,
    description: "",
    when: new Date(),
  });

  useEffect(() => {
    form.setForm({
      id: props.draft.id,
      type: props.draft.type,
      category: { id: props.draft.category?.id || "" },
      amount: props.draft.amount,
      description: props.draft.description,
      when: new Date(props.draft.when),
    });
  }, [props.draft]);

  const mappedErrors = useMemo(() => {
    const e: Partial<Record<keyof EntryCreateOrUpdateForm, string>> = { ...props.errors };

    form.errors.forEach((err) => {
      e[err.path] = err.message;
    });

    return e;
  }, [props.errors, form.errors]);

  const handleSubmit = () => {
    const result = entryDraftSchema.safeParse(form.values);
    if (!result.success) {
      const zodErrors = result.error.issues.map((err) => ({
        path: err.path[0] as keyof EntryCreateOrUpdateForm,
        message: err.message,
      }));
      form.setErrors(zodErrors);
      return;
    }
    props.onSubmit(result.data as EntryCreateOrUpdateForm);
  };

  return (
    <EntryForm
      title="Revisar Lançamento"
      submitButtonText="Salvar Alterações"
      values={form.values}
      errors={mappedErrors}
      hasErrors={form.hasErrors || !!props.errors}
      onChange={(path, value) => form.setValue(path, value)}
      onBackPress={props.onBackPress}
      onSubmit={handleSubmit}
      onDelete={
        props.onDelete
          ? () => {
              props.onDelete!(form.values);
            }
          : undefined
      }
    />
  );
}
