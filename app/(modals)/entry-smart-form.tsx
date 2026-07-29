import { EntryDraftForm } from "@/components/entries/EntryDraftForm";
import { EntryListItem } from "@/components/entries/EntryListItem";
import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { AppAntonioAvatar } from "@/components/ui/AppAntonioAvatar";
import { AppKeyboardDismissing } from "@/components/ui/AppKeyboardDismissing";
import { AppModalHeader } from "@/components/ui/AppModalHeader";
import { AppTextInput } from "@/components/ui/AppTextInput";
import { AudioWaveIndicator } from "@/components/ui/AudioWaveIndicator";
import { FormField } from "@/components/ui/FormField";
import { useCategories } from "@/hooks/queries/use-categories";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Entry } from "@/models/Entry";
import { EntryService } from "@/services/Api/EntryApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Button, Icon, TextInput as PaperTextInput, Text } from "react-native-paper";

export interface CreateSmartEntryForm {
  text: string;
  now: string;
}

export default function EntrySmartFormScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const categoriesQuery = useCategories();

  const createSmartEntryForm = useAppForm<CreateSmartEntryForm>({ text: "", now: "" });

  const [drafts, setDrafts] = useState<Entry[]>([]);
  const [editingDraft, setEditingDraft] = useState<Entry | null>(null);

  const smartEntryMutation = useMutation({
    mutationFn: EntryService.smartExtract,
    onSuccess: (data) => {
      createSmartEntryForm.clear();
      setSavedAudioUri(null);
      setSavedAudioDuration(0);

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

      queryClient.invalidateQueries({ queryKey: QueryKeys.Entry.getEntries() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getMonthlyEvolution() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getKpis() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getExpenseByCategory() });

      router.back();
    },
    onError: (error) => {
      if (!isAxiosError(error)) return;
      _setFeedbackMessage(
        error.response?.data.message || "Puxa, não consegui salvar seus lançamentos agora. Tente novamente em um instante!",
      );
    },
  });

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [savedAudioUri, setSavedAudioUri] = useState<string | null>(null);
  const [savedAudioDuration, setSavedAudioDuration] = useState<number>(0);
  const [_feedbackMessage, _setFeedbackMessage] = useState<string>("");

  const formatDuration = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    _setFeedbackMessage("Pode falar, estou te ouvindo...");
    setSavedAudioUri(null);
    setSavedAudioDuration(0);

    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);

        setRecordingDuration(0);
        recording.setOnRecordingStatusUpdate((status) => {
          setRecordingDuration(status.durationMillis);
        });
        recording.setProgressUpdateInterval(100);

        setRecording(recording);
      } else {
        _setFeedbackMessage("Preciso da sua permissão para usar o microfone e te ouvir!");
      }
    } catch (err) {
      _setFeedbackMessage("Deu um probleminha no microfone, infelizmente não consigo te ouvir agora.");
    }
  };

  const sendAudio = (uri: string) => {
    setSavedAudioUri(uri);
    const formData = new FormData();

    formData.append("file", {
      uri,
      name: "audio.m4a",
      type: "audio/m4a",
    } as any);
    formData.append("now", new Date().toISOString());

    smartEntryMutation.mutateAsync(formData as any);
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      const finalDuration = recordingDuration;

      setRecording(null);
      setRecordingDuration(0);

      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();

      if (uri) {
        setSavedAudioDuration(finalDuration);
        sendAudio(uri);
      }
    } catch (error) {
      _setFeedbackMessage("Deu um erro ao processar seu áudio, pode tentar de novo?");
    }
  };

  const abortRecording = async () => {
    if (!recording) return;

    try {
      setRecording(null);
      setRecordingDuration(0);

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
    if (drafts.length > 0)
      return "Consegui extrair esses lançamentos! Toque neles para editar caso precise, ou continue me mandando mais coisas.";

    return `Me conte o que você gastou ou recebeu, como se estivéssemos conversando! Exemplo: "Gastei 15 na padaria hoje de manhã e paguei 120 de luz na segunda-feira".`;
  }, [smartEntryMutation.isPending, bulkEntryMutation.isPending, drafts.length, _feedbackMessage]);

  const categories = useMemo(() => {
    return categoriesQuery.data?.data || [];
  }, [categoriesQuery.data]);

  const sortedDrafts = useMemo(() => {
    return [...drafts].sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime());
  }, [drafts]);

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

  if (editingDraft) {
    return (
      <EntryDraftForm
        draft={editingDraft}
        onBackPress={() => setEditingDraft(null)}
        onSubmit={(updatedDraft) => {
          setDrafts((previousDrafts) => {
            return previousDrafts.map((previousDraft) => {
              if (previousDraft.id === updatedDraft.id) {
                return {
                  ...previousDraft,
                  amount: updatedDraft.amount,
                  description: updatedDraft.description || "",
                  when: updatedDraft.when.toISOString(),
                  type: updatedDraft.type,
                  category:
                    updatedDraft.category?.id !== previousDraft.category?.id
                      ? categories.find((category) => category.id === updatedDraft.category?.id)
                      : previousDraft.category,
                };
              }
              return previousDraft;
            });
          });
          setEditingDraft(null);
        }}
        onDelete={() => {
          setDrafts((previousDrafts) => previousDrafts.filter((draft) => draft.id !== editingDraft.id));
          setEditingDraft(null);
        }}
      />
    );
  }

  return (
    <FullScreenLayout>
      <View className="h-full">
        <AppModalHeader
          title="Lançamento Inteligente"
          onBackPress={() => {
            abortRecording();
            router.back();
          }}
        />

        <AppKeyboardDismissing.ScrollView>
          <View className="grow p-4 flex flex-col gap-4">
            <View className="flex flex-1 flex-col gap-4">
              {drafts.length === 0 ? (
                <View className="px-2 flex flex-col items-center mb-8 mt-4">
                  <AppAntonioAvatar size="large" className="mb-4" />

                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, textAlign: "center" }}>
                    {feedbackMessage}
                  </Text>
                  {recording ? (
                    <View className="flex flex-row items-center justify-center mt-2">
                      <AudioWaveIndicator />

                      <Text style={{ color: theme.colors.error, fontWeight: "bold", marginLeft: 8 }}>
                        {formatDuration(recordingDuration)}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ) : (
                <View className="flex flex-row items-start gap-4 justify-center">
                  <AppAntonioAvatar size="medium" />

                  <View className="flex-1 flex-col">
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, flexShrink: 1 }}>
                      {feedbackMessage}
                    </Text>
                    {recording ? (
                      <View className="flex flex-row items-center mt-1">
                        <AudioWaveIndicator />
                        <Text style={{ color: theme.colors.error, fontWeight: "bold", marginLeft: 8 }}>
                          {formatDuration(recordingDuration)}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              )}

              {savedAudioUri && !smartEntryMutation.isPending && smartEntryMutation.isError && (
                <View className="flex flex-row items-center justify-between" style={{ borderRadius: theme.roundness }}>
                  <View className="pl-2 flex flex-row items-center gap-4 w-full">
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: "bold" }}>
                      {formatDuration(savedAudioDuration)}
                    </Text>

                    <View className="grow">
                      <AudioWaveIndicator staticWave />
                    </View>

                    <Button compact textColor={theme.colors.info} onPress={() => sendAudio(savedAudioUri)}>
                      Reenviar
                    </Button>
                  </View>
                </View>
              )}

              <FormField>
                <AppTextInput
                  mode="outlined"
                  label="O que você gastou/recebeu?"
                  value={createSmartEntryForm.values.text}
                  onChangeText={(text) => {
                    createSmartEntryForm.setValue("text", text);

                    if (savedAudioUri) {
                      setSavedAudioUri(null);
                      setRecordingDuration(0);
                      setRecording(null);
                    }
                  }}
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
                            now: new Date().toISOString(),
                          } as any);
                        }}
                      />
                    ) : recording ? (
                      <PaperTextInput.Icon
                        icon="stop-circle-outline"
                        color={theme.colors.error}
                        disabled={smartEntryMutation.isPending || bulkEntryMutation.isPending}
                        forceTextInputFocus={false}
                        onPress={handleMicPress}
                      />
                    ) : (
                      <PaperTextInput.Icon
                        icon="microphone"
                        color={theme.colors.onBackground}
                        disabled={smartEntryMutation.isPending || bulkEntryMutation.isPending}
                        forceTextInputFocus={false}
                        onPress={handleMicPress}
                      />
                    )
                  }
                />
              </FormField>

              {drafts.length > 0 && (
                <View className="mt-2 flex flex-col gap-2">
                  <Text variant="titleMedium">Rascunhos para Revisão</Text>

                  <View className="flex flex-col gap-4" style={{ paddingBottom: 160 }}>
                    {sortedDrafts.map((draft) => (
                      <EntryListItem key={draft.id} data={draft} hasError={!draft.amount} onPress={() => setEditingDraft(draft)} />
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </AppKeyboardDismissing.ScrollView>

        {drafts.length > 0 && (
          <View className="px-4">
            {drafts.some((e) => !e.amount) && (
              <View className="flex flex-row items-center justify-center gap-2 mt-4">
                <Icon source="alert-circle-outline" color={theme.colors.error} size={16} />
                <Text variant="bodySmall" style={{ color: theme.colors.error, fontWeight: "bold" }}>
                  Preencha o valor de todos os lançamentos
                </Text>
              </View>
            )}
            <Button
              className="mt-2"
              mode="contained"
              onPress={handleSaveBulk}
              loading={bulkEntryMutation.isPending}
              disabled={smartEntryMutation.isPending || bulkEntryMutation.isPending || drafts.some((e) => !e.amount)}
            >
              Confirmar e Salvar ({drafts.length})
            </Button>
          </View>
        )}
      </View>
    </FullScreenLayout>
  );
}
