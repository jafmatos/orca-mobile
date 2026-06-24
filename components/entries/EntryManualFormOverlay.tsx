import { AppForm, useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { Entry, EntryTypes } from "@/models/Entry";
import {
  CreateEntryBody,
  CreateEntryReturnType,
  EntryService,
  UpdateEntryBody,
  UpdateEntryReturnType,
} from "@/services/Api/EntryApiService";
import React, { useImperativeHandle } from "react";
import { AppFullScreenOverlayRef } from "../ui/AppFullScreenOverlay";
import { EntryCreateOrUpdateForm, EntryFormOverlay } from "./EntryFormOverlay";

export interface EntryManualFormOverlayProps {
  onSuccess?: (entry: Entry, mode: "creating" | "editing") => void;
}

export type EntryManualFormOverlayRef = AppFullScreenOverlayRef & {
  form: AppForm<EntryCreateOrUpdateForm>;
};

export const EntryManualFormOverlay = React.forwardRef<EntryManualFormOverlayRef, EntryManualFormOverlayProps>(
  function EntryManualFormOverlay(props: EntryManualFormOverlayProps, ref) {
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

    const { mutation: entryCreateOrUpdateMutation } = useAppFormWithMutation<
      EntryCreateOrUpdateForm,
      CreateEntryBody & UpdateEntryBody,
      CreateEntryReturnType | UpdateEntryReturnType
    >(form, {
      mutationFn: (body) => {
        if (form.values.id) return EntryService.update(form.values.id!, body);
        else return EntryService.create(body);
      },
      onSuccess: (data) => {
        form.clear();
        overlayRef.current?.close();
        props.onSuccess?.(data.entry, form.values.id ? "editing" : "creating");
      },
    });

    useImperativeHandle(ref, () => ({
      open: () => overlayRef.current?.open(),
      close: () => overlayRef.current?.close({ onFinished: () => form.clear() }),
      form,
    }));

    return (
      <EntryFormOverlay
        ref={overlayRef}
        title={form.values.id ? "Editar lançamento" : "Novo lançamento"}
        submitButtonText="Pronto"
        values={form.values}
        errors={form.errors.reduce(
          (errors, error) => {
            errors[error.path] = error.message;

            return errors;
          },
          {} as Record<keyof EntryCreateOrUpdateForm, string>,
        )}
        hasErrors={form.hasErrors}
        isSubmitting={entryCreateOrUpdateMutation.isPending}
        onChange={(path, value) => form.setValue(path, value)}
        onSubmit={() => entryCreateOrUpdateMutation.mutateAsync(form.values)}
      />
    );
  },
);
