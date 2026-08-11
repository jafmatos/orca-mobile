import { EntryDraftForm } from "@/components/entries/EntryDraftForm";
import { EntryListItem } from "@/components/entries/EntryListItem";
import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { AppAntonioAvatar } from "@/components/ui/AppAntonioAvatar";
import { AppAudioWaveIndicator } from "@/components/ui/AppAudioWaveIndicator";
import { AppFormField } from "@/components/ui/AppFormField";
import { AppModalHeader } from "@/components/ui/AppModalHeader";
import { AppTextInput } from "@/components/ui/AppTextInput";
import { AppKeyboardDismissing } from "@/components/utils/AppKeyboardDismissing";
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
import { View, TouchableOpacity } from "react-native";
import { Button, Icon, TextInput as PaperTextInput, Text, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

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
      setSelectedImages([]);

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
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

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

  const handleImagePress = async () => {
    if (selectedImages.length >= 3) {
      _setFeedbackMessage("Você pode enviar no máximo 3 imagens.");
      return;
    }

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        _setFeedbackMessage("Preciso da sua permissão para acessar a galeria de fotos!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: 3 - selectedImages.length,
        quality: 0.8,
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => asset.uri);
        setSelectedImages((prev) => {
          const combined = [...prev, ...newImages];
          return combined.slice(0, 3);
        });
      }
    } catch (error) {
      _setFeedbackMessage("Deu um erro ao abrir a galeria, pode tentar de novo?");
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
                      <AppAudioWaveIndicator />

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
                        <AppAudioWaveIndicator />
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
                      <AppAudioWaveIndicator staticWave />
                    </View>

                    <Button compact textColor={theme.colors.info} onPress={() => sendAudio(savedAudioUri)}>
                      Reenviar
                    </Button>
                  </View>
                </View>
              )}

              {selectedImages.length > 0 && (
                <View className="flex flex-row gap-4 mb-2">
                  {selectedImages.map((uri, index) => (
                    <View key={uri} className="relative">
                      <Image source={{ uri }} style={{ width: 80, height: 80, borderRadius: theme.roundness }} />
                      <View className="absolute -top-2 -right-2">
                        <TouchableOpacity
                          onPress={() => setSelectedImages((prev) => prev.filter((_, i) => i !== index))}
                          style={{ backgroundColor: theme.colors.background, borderRadius: 12 }}
                        >
                          <Icon source="close-circle" color={theme.colors.error} size={24} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              <View className="flex flex-row items-center gap-2">
                <AppFormField className="flex-1">
                  <AppTextInput
                    mode="outlined"
                    placeholder="O que você gastou/recebeu?"
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
                    dense
                    disabled={smartEntryMutation.isPending || bulkEntryMutation.isPending}
                    style={{ textAlignVertical: "center" }}
                    contentStyle={{ paddingTop: 12, paddingBottom: 12 }}
                    outlineStyle={[
                      { borderRadius: 24 },
                      smartEntryMutation.isPending && { borderColor: theme.colors.outlineVariant },
                    ]}
                    right={
                      <PaperTextInput.Icon
                        icon="camera-outline"
                        color={theme.colors.onBackground}
                        disabled={
                          smartEntryMutation.isPending || bulkEntryMutation.isPending || recording !== null || selectedImages.length >= 3
                        }
                        forceTextInputFocus={false}
                        onPress={handleImagePress}
                      />
                    }
                  />
                </AppFormField>

                {!!createSmartEntryForm.values.text.trim().length || selectedImages.length > 0 ? (
                  <IconButton
                    mode="contained"
                    icon="send-outline"
                    containerColor={theme.colors.primary}
                    iconColor={theme.colors.onPrimary}
                    size={20}
                    style={{ margin: 0, width: 48, height: 48, borderRadius: 24 }}
                    disabled={smartEntryMutation.isPending || bulkEntryMutation.isPending}
                    onPress={() => {
                      if (selectedImages.length > 0) {
                        const formData = new FormData();
                        if (createSmartEntryForm.values.text.trim().length > 0) {
                          formData.append("text", createSmartEntryForm.values.text);
                        }
                        formData.append("now", new Date().toISOString());

                        selectedImages.forEach((uri, index) => {
                          formData.append("files", {
                            uri,
                            name: `image_${index}.jpg`,
                            type: "image/jpeg",
                          } as any);
                        });

                        smartEntryMutation.mutateAsync(formData as any);
                      } else {
                        smartEntryMutation.mutateAsync({
                          text: createSmartEntryForm.values.text,
                          now: new Date().toISOString(),
                        } as any);
                      }
                    }}
                  />
                ) : recording ? (
                  <IconButton
                    mode="contained"
                    icon="stop"
                    containerColor={theme.colors.error}
                    iconColor={theme.colors.onError}
                    size={24}
                    style={{ margin: 0, width: 48, height: 48, borderRadius: 24 }}
                    disabled={smartEntryMutation.isPending || bulkEntryMutation.isPending}
                    onPress={handleMicPress}
                  />
                ) : (
                  <IconButton
                    mode="contained"
                    icon="microphone-outline"
                    containerColor={theme.colors.primary}
                    iconColor={theme.colors.onPrimary}
                    size={24}
                    style={{ margin: 0, width: 48, height: 48, borderRadius: 24 }}
                    disabled={smartEntryMutation.isPending || bulkEntryMutation.isPending}
                    onPress={handleMicPress}
                  />
                )}
              </View>

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
