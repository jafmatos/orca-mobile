import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { Entry, EntryTypes } from "@/models/Entry";
import {
  CreateEntryBody,
  CreateEntryReturnType,
  EntryService,
  UpdateEntryBody,
  UpdateEntryReturnType,
} from "@/services/Api/EntryApiService";
import React, { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { EntryCreateOrUpdateForm, EntryForm } from "@/components/entries/EntryForm";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/utils/QueryKeys";
import { useEntries } from "@/hooks/queries/use-entries";

export default function EntryManualFormScreen() {
  const { id, duplicateFromId } = useLocalSearchParams<{ id?: string; duplicateFromId?: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const entriesQuery = useEntries();

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
    const targetId = id || duplicateFromId;
    if (targetId && entriesQuery.data?.pages) {
      const entries = entriesQuery.data.pages.flatMap((p) => p.data);
      const entry = entries.find((e) => e.id === targetId);
      if (entry) {
        form.setForm({
          id: id ? entry.id : undefined, // only set id if we are editing, not duplicating
          type: entry.type,
          category: entry.category ? { id: entry.category.id } : { id: "" },
          amount: entry.amount,
          description: entry.description,
          when: id ? new Date(entry.when) : new Date(), // use current date for duplicates
        });
      }
    }
  }, [id, duplicateFromId, entriesQuery.data?.pages]);

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
      queryClient.invalidateQueries({ queryKey: QueryKeys.Entry.getEntries() });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Overview.getKpis()[0]] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Overview.getExpenseByCategory()[0]] });
      
      router.back();
    },
  });

  return (
    <EntryForm
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
}
