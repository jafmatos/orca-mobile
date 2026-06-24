import { AppForm, useAppForm } from "@/hooks/use-app-form";
import { EntryTypes } from "@/models/Entry";
import React, { useImperativeHandle } from "react";
import { AppFullScreenOverlayRef } from "../ui/AppFullScreenOverlay";
import { EntryCreateOrUpdateForm, EntryFormOverlay } from "./EntryFormOverlay";

export interface EntryDraftFormOverlayProps {
  onSubmit: (draft: EntryCreateOrUpdateForm) => void;
  onDelete?: (draft: EntryCreateOrUpdateForm) => void;
  errors?: Partial<Record<keyof EntryCreateOrUpdateForm, string>>;
}

export type EntryDraftFormOverlayRef = AppFullScreenOverlayRef & {
  form: AppForm<EntryCreateOrUpdateForm>;
};

export const EntryDraftFormOverlay = React.forwardRef<EntryDraftFormOverlayRef, EntryDraftFormOverlayProps>(function EntryDraftFormOverlay(
  props: EntryDraftFormOverlayProps,
  ref,
) {
  const overlayRef = React.useRef<AppFullScreenOverlayRef>(null);

  const form = useAppForm<EntryCreateOrUpdateForm>({
    type: EntryTypes.Expense,
    category: {
      id: "",
    },
    amount: 0,
    description: "",
    when: new Date(),
  });

  useImperativeHandle(ref, () => ({
    open: () => overlayRef.current?.open(),
    close: () => overlayRef.current?.close({ onFinished: () => form.clear() }),
    form,
  }));

  return (
    <EntryFormOverlay
      ref={overlayRef}
      title="Revisar Lançamento"
      submitButtonText="Salvar Alterações"
      values={form.values}
      errors={props.errors}
      hasErrors={form.hasErrors}
      onChange={(path, value) => form.setValue(path, value)}
      onSubmit={() => {
        props.onSubmit(form.values);

        overlayRef.current?.close();
      }}
      onDelete={
        props.onDelete
          ? () => {
              props.onDelete!(form.values);
              overlayRef.current?.close();
            }
          : undefined
      }
    />
  );
});
