import { AIAnalysisList } from "@/components/analyses/AIAnalysisList";
import { AIAnalysisListItem } from "@/components/analyses/AIAnalysisListItem";
import { AIAnalysisGenerationLoadingOverlay } from "@/components/analyses/AIAnalysisGenerationLoadingOverlay";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { AppConfirmationDialog } from "@/components/ui/AppConfirmationDialog";
import { AppFabOverlay } from "@/components/ui/AppFabOverlay";
import { AppSkeleton } from "@/components/ui/AppSkeleton";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppToast } from "@/hooks/use-app-toast";
import { AIAnalysis } from "@/models/AIAnalysis";
import { ApiErrorResponseData } from "@/models/ApiErrorResponseData";
import { AIAnalysisService, CreateAIAnalysisReturnType, DeleteAIAnalysisReturnType } from "@/services/Api/AIAnalysisApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { BottomSheetRef } from "jam-bottomsheet";
import React, { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";
import { Divider, FAB, Icon, IconButton, Text } from "react-native-paper";

export default function AnalysesScreen() {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AIAnalysis>();
  const detailBottomSheetRef = React.useRef<BottomSheetRef>(null);

  const theme = useAppTheme();
  const toast = useAppToast();
  const queryClient = useQueryClient();

  const openAnalysisDetail = useCallback((analysis: AIAnalysis) => {
    detailBottomSheetRef.current?.open({
      onFinished: () => setSelectedAnalysis(analysis),
    });
  }, []);

  const closeAnalysisDetail = useCallback(() => {
    detailBottomSheetRef.current?.close({
      onFinished: () => setSelectedAnalysis(undefined),
    });
  }, []);

  const createAnalysisMutation = useMutation<CreateAIAnalysisReturnType, Error, void>({
    mutationFn: async () => {
      return AIAnalysisService.create();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QueryKeys.AIAnalysis.getAnalyses(), (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData;
        
        const newPages = [...oldData.pages];

        if (newPages.length > 0) {
          newPages[0] = {
            ...newPages[0],
            data: [data.analysis, ...newPages[0].data],
          };
        }
        
        return {
          ...oldData,
          pages: newPages,
        };
      });

      openAnalysisDetail(data.analysis);
    },
    onError: (error: any) => {
      if (error.response?.data instanceof ApiErrorResponseData) {
        toast.error({
          title: "Ops...",
          description: error.response.data.message || "Erro ao gerar análise",
        });
      } else {
        toast.error({
          title: "Ops...",
          description: "Ocorreu um erro inesperado ao gerar a análise.",
        });
      }
    },
  });

  const deleteAnalysisMutation = useMutation<DeleteAIAnalysisReturnType, Error, string>({
    mutationFn: async (id) => {
      return AIAnalysisService.delete(id);
    },
    onSuccess: () => {
      toast.success({
        title: "Análise removida!",
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.AIAnalysis.getAnalyses(), refetchType: "all" });
      closeAnalysisDetail();
    },
    onError: (error: any) => {
      if (error.response?.data instanceof ApiErrorResponseData) {
        toast.error({
          title: "Ops...",
          description: error.response.data.message || "Erro ao remover análise",
        });
      }
    },
  });

  const renderItem = useCallback(
    ({ item }: { item: AIAnalysis }) => {
      return <AIAnalysisListItem analysis={item} onPress={() => openAnalysisDetail(item)} />;
    },
    [openAnalysisDetail],
  );

  return (
    <TabbedLayout>
      <Navigation hideCurrencyToggle />

      <AIAnalysisList
        renderItem={renderItem}
        ListHeaderComponent={
          <View className="flex flex-col items-center mt-4 mb-8">
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.tertiary]}
              style={{ borderRadius: 24, padding: 24, justifyContent: "center", alignItems: "center", marginBottom: 16 }}
            >
              <Icon source="robot-outline" size={48} color={theme.colors.onPrimary} />
            </LinearGradient>

            <Text variant="headlineSmall" style={{ fontWeight: "900", textAlign: "center" }}>
              Olá, eu sou o Antônio!
            </Text>

            <Text
              variant="bodyLarge"
              style={{ color: theme.colors.onSurfaceVariant, textAlign: "center", marginTop: 8, paddingHorizontal: 16 }}
            >
              Sou seu analista financeiro movido a Inteligência Artificial. Analiso seus gastos e crio estratégias personalizadas para o seu
              dinheiro render mais.
            </Text>
          </View>
        }
      />

      <AppFabOverlay>
        <FAB
          customSize={80}
          icon="creation"
          theme={{
            colors: {
              primaryContainer: theme.colors.tertiaryContainer,
              onPrimaryContainer: theme.colors.onTertiaryContainer,
            },
          }}
          disabled={createAnalysisMutation.isPending}
          onPress={() => createAnalysisMutation.mutate()}
        />
      </AppFabOverlay>

      <AIAnalysisGenerationLoadingOverlay visible={createAnalysisMutation.isPending} />

      <AppBottomSheet
        imperative
        fullscreen
        ref={detailBottomSheetRef}
        onCloseAnimationFinished={() => {
          setSelectedAnalysis(undefined);
        }}
      >
        <ScrollView contentContainerClassName="flex flex-col gap-6 pb-8" showsVerticalScrollIndicator={false}>
          {selectedAnalysis ? (
            <View className="flex flex-col gap-6">
              <View className="flex flex-row justify-between items-start gap-4">
                <View className="flex flex-row gap-4 flex-1">
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.tertiary]}
                    style={{ borderRadius: 16, padding: 12, justifyContent: "center", alignItems: "center" }}
                  >
                    <Icon source="robot-outline" size={32} color={theme.colors.onPrimary} />
                  </LinearGradient>

                  <View className="flex flex-col gap-1" style={{ flexShrink: 1 }}>
                    <Text style={{ fontWeight: "bold" }} variant="titleLarge">
                      O que o Antônio diz...
                    </Text>

                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {new Date(selectedAnalysis.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>

                <AppConfirmationDialog
                  trigger={({ open }) => (
                    <IconButton
                      disabled={!selectedAnalysis}
                      icon="trash-can"
                      iconColor={theme.colors.error}
                      onPress={open}
                      style={{ margin: 0 }}
                    />
                  )}
                  title="Remover análise?"
                  description="Tem certeza de que deseja remover esta análise? Não será possível recuperá-la."
                  confirmText="Remover"
                  onConfirm={async (close) => {
                    await deleteAnalysisMutation.mutateAsync(selectedAnalysis.id);
                    close();
                  }}
                  confirmButtonProps={{
                    loading: deleteAnalysisMutation.isPending,
                    disabled: deleteAnalysisMutation.isPending,
                  }}
                  closeOnCancel
                />
              </View>

              <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, textAlign: "justify" }}>
                {selectedAnalysis.output.diagnostic}
              </Text>

              <Divider />

              <View className="flex flex-col gap-6">
                <View className="flex flex-row items-center gap-2">
                  <Icon source="alert-circle-outline" size={24} color={theme.colors.error} />

                  <Text variant="titleLarge" style={{ color: theme.colors.error, fontWeight: "bold" }}>
                    Problemas Identificados
                  </Text>
                </View>

                {selectedAnalysis.output.issues.map((issue, index) => (
                  <View key={index} className="flex flex-row items-start">
                    <View className="w-1 h-full opacity-30 mr-3 mt-1" style={{ backgroundColor: theme.colors.error, borderRadius: 2 }} />

                    <View className="flex flex-col gap-1" style={{ flexShrink: 1 }}>
                      <Text variant="bodyLarge">{issue.title}</Text>

                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        <Text style={{ fontWeight: "bold", color: theme.colors.error }}>Impacto: </Text>
                        {issue.effect}
                      </Text>
                    </View>
                  </View>
                ))}

                {selectedAnalysis.output.issues.length === 0 && (
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Nenhum problema crítico identificado.
                  </Text>
                )}
              </View>

              <Divider />

              <View className="flex flex-col gap-6">
                <View className="flex flex-row items-center gap-2">
                  <Icon source="check-circle-outline" size={24} color={theme.colors.success} />

                  <Text variant="titleLarge" style={{ fontWeight: "bold", color: theme.colors.success }}>
                    Ações Recomendadas
                  </Text>
                </View>

                {selectedAnalysis.output.actions.map((action, index) => (
                  <View key={index} className="flex flex-row items-start">
                    <View className="w-1 h-full opacity-30 mr-3 mt-1" style={{ backgroundColor: theme.colors.success, borderRadius: 2 }} />

                    <View className="grow flex flex-col gap-1" style={{ flexShrink: 1 }}>
                      <Text variant="bodyLarge">{action.title}</Text>

                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        <Text style={{ fontWeight: "bold", color: theme.colors.success }}>Resultado esperado: </Text>
                        {action.effect}
                      </Text>
                    </View>
                  </View>
                ))}
                {selectedAnalysis.output.actions.length === 0 && (
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Nenhuma ação específica recomendada no momento.
                  </Text>
                )}
              </View>

              <Divider />

              <View className="flex flex-col gap-6">
                <View className="flex flex-row items-center gap-2">
                  <Icon source="trending-up" size={24} color={theme.colors.primary} />

                  <Text variant="titleLarge" style={{ fontWeight: "bold", color: theme.colors.primary }}>
                    Expectativa
                  </Text>
                </View>

                <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, textAlign: "justify" }}>
                  {selectedAnalysis.output.expectation}
                </Text>
              </View>
            </View>
          ) : (
            <View className="flex flex-col gap-6">
              <View className="flex flex-row justify-between items-center gap-4">
                <View className="flex flex-row gap-4 flex-1">
                  <View style={{ borderRadius: 16, overflow: "hidden", width: 56, height: 56 }}>
                    <AppSkeleton />
                  </View>
                  <View style={{ flexShrink: 1, paddingTop: 4, gap: 8 }}>
                    <AppSkeleton height={24} width={180} />
                    <AppSkeleton height={16} width={120} />
                  </View>
                </View>
              </View>

              <View className="flex flex-col gap-2 mt-2">
                <AppSkeleton height={16} width="100%" />
                <AppSkeleton height={16} width="100%" />
                <AppSkeleton height={16} width="80%" />
              </View>

              <Divider />

              <View className="flex flex-col gap-6">
                <View className="flex flex-row items-center gap-2">
                  <View style={{ borderRadius: 12, overflow: "hidden", width: 24, height: 24 }}>
                    <AppSkeleton />
                  </View>
                  <AppSkeleton height={24} width={160} />
                </View>
                {[1, 2].map((i) => (
                  <View key={i} className="flex flex-row items-start">
                    <View
                      className="w-1 h-12 opacity-30 mr-3 mt-1"
                      style={{ backgroundColor: theme.colors.surfaceVariant, borderRadius: 2 }}
                    />
                    <View className="flex flex-col gap-2 grow">
                      <AppSkeleton height={16} width="90%" />
                      <AppSkeleton height={16} width="70%" />
                    </View>
                  </View>
                ))}
              </View>

              <Divider />

              <View className="flex flex-col gap-6">
                <View className="flex flex-row items-center gap-2">
                  <View style={{ borderRadius: 12, overflow: "hidden", width: 24, height: 24 }}>
                    <AppSkeleton />
                  </View>
                  <AppSkeleton height={24} width={180} />
                </View>
                {[1, 2].map((i) => (
                  <View key={i} className="flex flex-row items-start">
                    <View
                      className="w-1 h-12 opacity-30 mr-3 mt-1"
                      style={{ backgroundColor: theme.colors.surfaceVariant, borderRadius: 2 }}
                    />
                    <View className="flex flex-col gap-2 grow">
                      <AppSkeleton height={16} width="85%" />
                      <AppSkeleton height={16} width="65%" />
                    </View>
                  </View>
                ))}
              </View>

              <Divider />

              <View className="flex flex-col gap-6">
                <View className="flex flex-row items-center gap-2">
                  <View style={{ borderRadius: 12, overflow: "hidden", width: 24, height: 24 }}>
                    <AppSkeleton />
                  </View>
                  <AppSkeleton height={24} width={120} />
                </View>
                <View className="flex flex-col gap-2">
                  <AppSkeleton height={16} width="100%" />
                  <AppSkeleton height={16} width="90%" />
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </AppBottomSheet>
    </TabbedLayout>
  );
}
