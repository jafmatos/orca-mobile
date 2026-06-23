import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Entry } from "@/models/Entry";
import { CreateSmartEntryBody, CreateSmartEntryReturnType, EntryService } from "@/services/Api/EntryApiService";
import { Audio } from "expo-av";
import React, { useImperativeHandle, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, HelperText, Text } from "react-native-paper";
import { AppTextInput } from "../ui/AppTextInput";
import { TextInput as PaperTextInput } from "react-native-paper";
import { AppAntonioAvatar } from "../ui/AppAntonioAvatar";
import { AppFullScreenOverlay, AppFullScreenOverlayRef } from "../ui/AppFullScreenOverlay";
import { FormField } from "../ui/FormField";
import { EntryListItem } from "./EntryListItem";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { AppKeyboardDismissing } from "../ui/AppKeyboardDismissing";

export interface EntrySmartFormOverlayProps {
  onSuccess?: (entry: Entry) => void;
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
  const createSmartEntryForm = useAppForm<CreateSmartEntryForm>({ text: "", now: "" });

  const [createdEntries, setCreatedEntries] = useState<Entry[]>([]);

  const smartEntryMutation = useMutation({
    mutationFn: EntryService.createSmart,
    onSuccess: (data) => {
      createSmartEntryForm.clear();
      _setFeedbackMessage("");
      setCreatedEntries((prev) => [data.entry, ...prev]);
      props.onSuccess?.(data.entry);
    },
    onError: (error) => {
      if (!isAxiosError(error)) return;

      _setFeedbackMessage(error.response?.data.message || "Parece que houve um erro inesperado, tente novamente");
    },
  });

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [_feedbackMessage, _setFeedbackMessage] = useState<string>("");

  const startRecording = async () => {
    _setFeedbackMessage("Estou te ouvindo...");

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
        _setFeedbackMessage("Sem permissão para acessar o microfone");
      }
    } catch (err) {
      _setFeedbackMessage("Erro ao iniciar gravação");
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
      _setFeedbackMessage("Erro ao parar gravação");
    }
  };

  const abortRecording = async () => {
    if (!recording) return;

    try {
      setRecording(null);

      await recording.stopAndUnloadAsync();
    } catch (error) {
      _setFeedbackMessage("Erro ao abortar gravação");
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
    if (smartEntryMutation.isPending) return "Analisando...";
    if (_feedbackMessage) return _feedbackMessage;
    if (createdEntries.length > 0) return "Lançamento salvo! Pode continuar me falando os próximos.";

    return `Descreva seu lançamento como se estivesse conversando comigo. Por exemplo: "Hoje de manhã fui à padaria comprar seis reais de pão".`;
  }, [smartEntryMutation.isPending, createdEntries.length, _feedbackMessage]);

  useImperativeHandle(ref, () => {
    return {
      open: () => overlayRef.current?.open(),
      close: () => overlayRef.current?.close(),
    };
  });

  return (
    <AppFullScreenOverlay
      ref={overlayRef}
      title="Lançamento Inteligente"
      onCloseAnimationFinished={() => {
        createSmartEntryForm.clear();
        abortRecording();
        setCreatedEntries([]);
      }}
    >
      <AppKeyboardDismissing.View>
        <View className="p-4 flex flex-col gap-4 h-full">
          <View className="flex-1">
            {createdEntries.length === 0 ? (
              <View className="flex flex-col items-center mb-8 mt-4">
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
                disabled={smartEntryMutation.isPending}
                outlineStyle={smartEntryMutation.isPending ? { borderColor: theme.colors.outlineVariant } : undefined}
                right={
                  !!createSmartEntryForm.values.text.trim().length ? (
                    <PaperTextInput.Icon
                      icon="arrow-right"
                      color={theme.colors.onBackground}
                      disabled={smartEntryMutation.isPending}
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
                      disabled={smartEntryMutation.isPending}
                      forceTextInputFocus={false}
                      onPress={handleMicPress}
                    />
                  )
                }
              />
            </FormField>

            {createdEntries.length > 0 && (
              <ScrollView className="flex-1 mt-6" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text variant="titleMedium" style={{ marginBottom: 12 }}>
                  Adicionados agora
                </Text>

                <View className="flex flex-col gap-4 pb-4">
                  {createdEntries.map((entry) => (
                    <EntryListItem key={entry.id} data={entry} />
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </AppKeyboardDismissing.View>
    </AppFullScreenOverlay>
  );
});
