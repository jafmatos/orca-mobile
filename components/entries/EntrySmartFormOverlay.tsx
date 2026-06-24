import { useAppForm } from "@/hooks/use-app-form";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Entry, EntryTypes } from "@/models/Entry";
import { CreateBulkEntryBody, EntryService } from "@/services/Api/EntryApiService";
import { Audio } from "expo-av";
import React, { useImperativeHandle, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { AppTextInput } from "../ui/AppTextInput";
import { TextInput as PaperTextInput } from "react-native-paper";
import { AppAntonioAvatar } from "../ui/AppAntonioAvatar";
import { AppFullScreenOverlay, AppFullScreenOverlayRef } from "../ui/AppFullScreenOverlay";
import { FormField } from "../ui/FormField";
import { EntryListItem } from "./EntryListItem";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { AppKeyboardDismissing } from "../ui/AppKeyboardDismissing";
import { EntryCreateOrUpdateForm } from "./EntryFormOverlay";
import { EntryDraftFormOverlay, EntryDraftFormOverlayRef } from "./EntryDraftFormOverlay";
import { useCategories } from "@/hooks/queries/use-categories";

export interface EntrySmartFormOverlayProps {
  onSuccess?: (entries: Entry[]) => void;
}

export interface CreateSmartEntryForm {
  text: string;
  now: string;
}

export type EntrySmartFormOverlayRef = AppFullScreenOverlayRef;

export const EntrySmartFormOverlay = React.forwardRef<EntrySmartFormOverlayRef, EntrySmartFormOverlayProps>(function EntrySmartFormOverlay(
  props: EntrySmartFormOverlayProps,
  ref,
) {
  const theme = useAppTheme();
  const overlayRef = React.useRef<AppFullScreenOverlayRef>(null);
  const draftFormOverlayRef = React.useRef<EntryDraftFormOverlayRef>(null);
  const categoriesQuery = useCategories();

  const createSmartEntryForm = useAppForm<CreateSmartEntryForm>({ text: "", now: "" });

  const [drafts, setDrafts] = useState<Entry[]>([]);

  const smartEntryMutation = useMutation({
    mutationFn: EntryService.createSmart,
    onSuccess: (data) => {
      createSmartEntryForm.clear();

      _setFeedbackMessage("");
      setDrafts((prev) => [
        ...prev,
        ...data.entries.map((entry) => {
          return {
            ...entry,
            id: Math.random().toString(36).substring(2, 15),
          };
        }),
      ]);
    },
    onError: (error) => {
      if (!isAxiosError(error)) return;

      _setFeedbackMessage(error.response?.data.message || "Ops, me confundi aqui! Pode tentar novamente?");
    },
  });

  const bulkEntryMutation = useMutation({
    mutationFn: EntryService.createBulk,
    onSuccess: (data) => {
      setDrafts([]);
      createSmartEntryForm.clear();
      _setFeedbackMessage("");
      props.onSuccess?.(data.entries);
      overlayRef.current?.close();
    },
    onError: (error) => {
      if (!isAxiosError(error)) return;
      _setFeedbackMessage(error.response?.data.message || "Puxa, não consegui salvar seus lançamentos agora. Tente novamente em um instante!");
    },
  });

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [_feedbackMessage, _setFeedbackMessage] = useState<string>("");

  const startRecording = async () => {
    _setFeedbackMessage("Pode falar, estou te ouvindo...");

    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);

        setRecording(recording);
      } else {
        _setFeedbackMessage("Preciso da sua permissão para usar o microfone e te ouvir!");
      }
    } catch (err) {
      _setFeedbackMessage("Deu um probleminha no microfone, infelizmente não consigo te ouvir agora.");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setRecording(null);

      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();

      if (uri) {
        const formData = new FormData();

        formData.append("audio", {
          uri,
          name: "audio.m4a",
          type: "audio/m4a",
        } as any);
        formData.append("now", new Date().toISOString());

        smartEntryMutation.mutateAsync(formData);
      }
    } catch (error) {
      _setFeedbackMessage("Deu um erro ao processar seu áudio, pode tentar de novo?");
    }
  };

  const abortRecording = async () => {
    if (!recording) return;

    try {
      setRecording(null);

      await recording.stopAndUnloadAsync();
    } catch (error) {
      _setFeedbackMessage("Não consegui cancelar a gravação corretamente.");
    }
  };

  const handleMicPress = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const feedbackMessage = useMemo(() => {
    if (smartEntryMutation.isPending) return "Deixa comigo, estou analisando o que você me enviou...";
    if (bulkEntryMutation.isPending) return "Pronto! Estou guardando seus lançamentos...";
    if (_feedbackMessage) return _feedbackMessage;
    if (drafts.length > 0) return "Consegui extrair esses lançamentos! Toque neles para editar caso precise, ou continue me mandando mais coisas.";

    return `Me conte o que você gastou ou recebeu, como se estivéssemos conversando! Exemplo: "Gastei 15 na padaria hoje de manhã e paguei 120 de luz na segunda-feira".`;
  }, [smartEntryMutation.isPending, bulkEntryMutation.isPending, drafts.length, _feedbackMessage]);

  const categories = useMemo(() => {
    return categoriesQuery.data?.data || [];
  }, [categoriesQuery.data]);

  useImperativeHandle(ref, () => {
    return {
      open: () => overlayRef.current?.open(),
      close: () => overlayRef.current?.close(),
    };
  });

  const handleSaveBulk = () => {
    const validEntries = drafts.map((p) => ({
      type: p.type,
      amount: p.amount || 0,
      description: p.description || undefined,
      when: p.when,
      category: p.category ? { id: p.category.id } : undefined,
    }));

    bulkEntryMutation.mutateAsync({ entries: validEntries });
  };

  return (
    <AppFullScreenOverlay
      ref={overlayRef}
      title="Lançamento Inteligente"
      onCloseAnimationFinished={() => {
        createSmartEntryForm.clear();

        abortRecording();
        setDrafts([]);
      }}
    >
      <AppKeyboardDismissing.View>
        <View className="p-4 flex flex-col gap-4 h-full">
          <View className="flex-1">
            {drafts.length === 0 ? (
              <View className="px-2 flex flex-col items-center mb-8 mt-4">
                <AppAntonioAvatar size="large" className="mb-4" />

                <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, textAlign: "center" }}>
                  {feedbackMessage}
                </Text>
              </View>
            ) : (
              <View className="flex flex-row items-start mb-6 mt-2 gap-4 justify-center">
                <AppAntonioAvatar size="medium" />

                <Text className="grow" variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flexShrink: 1 }}>
                  {feedbackMessage}
                </Text>
              </View>
            )}

            <FormField>
              <AppTextInput
                mode="outlined"
                label="O que você gastou/recebeu?"
                value={createSmartEntryForm.values.text}
                onChangeText={createSmartEntryForm.makeSetter("text")}
                multiline
                numberOfLines={4}
                disabled={smartEntryMutation.isPending || bulkEntryMutation.isPending}
                outlineStyle={smartEntryMutation.isPending ? { borderColor: theme.colors.outlineVariant } : undefined}
                right={
                  !!createSmartEntryForm.values.text.trim().length ? (
                    <PaperTextInput.Icon
                      icon="arrow-right"
                      color={theme.colors.onBackground}
                      disabled={smartEntryMutation.isPending || bulkEntryMutation.isPending}
                      forceTextInputFocus={false}
                      onPress={() => {
                        smartEntryMutation.mutateAsync({
                          text: createSmartEntryForm.values.text,
                          now: new Date(),
                        });
                      }}
                    />
                  ) : (
                    <PaperTextInput.Icon
                      icon={recording ? "stop-circle-outline" : "microphone"}
                      color={recording ? theme.colors.error : theme.colors.onBackground}
                      disabled={smartEntryMutation.isPending || bulkEntryMutation.isPending}
                      forceTextInputFocus={false}
                      onPress={handleMicPress}
                    />
                  )
                }
              />
            </FormField>

            {drafts.length > 0 && (
              <ScrollView className="flex-1 mt-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text variant="titleMedium" style={{ marginBottom: 12 }}>
                  Rascunhos para Revisão
                </Text>

                <View className="flex flex-col gap-4 pb-4">
                  {drafts.map((draft) => (
                    <EntryListItem
                      key={draft.id}
                      data={draft}
                      onPress={() => {
                        draftFormOverlayRef.current?.form.setForm({
                          id: draft.id,
                          amount: draft.amount,
                          type: draft.type,
                          when: new Date(draft.when),
                          description: draft.description,
                          category: { id: draft.category?.id || "" },
                        });
                        draftFormOverlayRef.current?.open();
                      }}
                    />
                  ))}
                </View>
              </ScrollView>
            )}

            {drafts.length > 0 && (
              <Button
                mode="contained"
                className="mt-4"
                onPress={handleSaveBulk}
                loading={bulkEntryMutation.isPending}
                disabled={smartEntryMutation.isPending || bulkEntryMutation.isPending || drafts.some((e) => !e.amount)}
              >
                Confirmar e Salvar ({drafts.length})
              </Button>
            )}
          </View>
        </View>
      </AppKeyboardDismissing.View>

      <EntryDraftFormOverlay
        ref={draftFormOverlayRef}
        onSubmit={(updatedDraft) => {
          setDrafts((previousDrafts) => {
            return previousDrafts.map((previousDraft) => {
              if (previousDraft.id === updatedDraft.id) {
                return {
                  ...previousDraft,
                  amount: updatedDraft.amount,
                  description: updatedDraft.description,
                  when: updatedDraft.when,
                  type: updatedDraft.type,
                  category:
                    updatedDraft.category.id !== previousDraft.category?.id
                      ? categories.find((category) => category.id === updatedDraft.category.id)
                      : previousDraft.category,
                };
              }

              return previousDraft;
            });
          });
        }}
        onDelete={() => {
          const draftId = draftFormOverlayRef.current?.form.metadata?.id;
          if (draftId) {
            setDrafts((previousDrafts) => previousDrafts.filter((draft) => draft.id !== draftId));
          }
        }}
      />
    </AppFullScreenOverlay>
  );
});
