import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { AppModalHeader } from "@/components/ui/AppModalHeader";
import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { useAppTheme } from "@/hooks/use-app-theme";
import { SubscriptionApiService } from "@/services/Api/SubscriptionApiService";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { QueryKeys } from "@/utils/QueryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Button, Icon, Surface, Text } from "react-native-paper";
import { useAppToast } from "@/hooks/use-app-toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppLayoutConstants } from "@/constants/layout";
import { SubscriptionPromoCard } from "@/components/profile/SubscriptionPromoCard";
import { SubscriptionCard } from "@/components/SubscriptionCard";

export default function ManageSubscriptionScreen() {
  const authUserQuery = useAuthUser();
  const theme = useAppTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useAppToast();
  const insets = useSafeAreaInsets();
  const toastOffset = insets.top + AppLayoutConstants.headerHeight + AppLayoutConstants.toastBaseOffset;

  const cancelMutation = useMutation({
    mutationFn: () => SubscriptionApiService.cancel(),
    onSuccess: (data) => {
      queryClient.setQueryData(QueryKeys.User.getAuthUser(), { user: data.user });
      queryClient.invalidateQueries({ queryKey: QueryKeys.User.getAuthUser() });
      toast.success({
        title: "Sucesso!",
        description: "Assinatura cancelada com sucesso.",
        topOffset: toastOffset,
      });
      router.back();
    },
    onError: (error: any) => {
      toast.error({
        title: "Ops...",
        description: error.response?.data?.message || error.message || "Erro ao cancelar assinatura",
        topOffset: toastOffset,
      });
    },
  });

  const authUser = useMemo(() => {
    return authUserQuery.data?.user;
  }, [authUserQuery.data]);

  const formattedPeriodEnd = useMemo(() => {
    return authUser?.subscription?.currentPeriodEnd ? new Date(authUser.subscription.currentPeriodEnd).toLocaleDateString("pt-BR") : "";
  }, [authUser?.subscription?.currentPeriodEnd]);

  return (
    <FullScreenLayout>
      <AppModalHeader title="Assinatura" />
      <ScrollView className="p-4" contentContainerStyle={{ gap: 24 }}>
        {authUser?.subscription && (
          <SubscriptionCard>
            <SubscriptionCard.Header title={authUser?.subscription?.plan.name!} />

            <SubscriptionCard.Content>
              <Text variant="bodyMedium" style={{ color: theme.colors.onPrimary }}>
                {currencyFormatter.format(authUser?.subscription?.plan.price)}/mês
              </Text>
            </SubscriptionCard.Content>
          </SubscriptionCard>
        )}

        <View style={{ gap: 16 }}>
          <Text variant="titleMedium" style={{ fontWeight: "bold", paddingLeft: 4 }}>
            Detalhes do Plano
          </Text>

          <View className="flex flex-col gap-4 px-1">
            <View className="flex flex-row justify-between items-center">
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                Status
              </Text>
              <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
                {authUser?.subscription?.traducedStatus || "Ativa"}
              </Text>
            </View>
            <View className="flex flex-row justify-between items-center">
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                Próxima Cobrança
              </Text>
              <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
                {formattedPeriodEnd || "--"}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ gap: 8, marginTop: 16 }}>
          <Text variant="bodyMedium" style={{ textAlign: "center", color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
            Deseja interromper o uso dos recursos premium?
          </Text>
          <Button
            mode="contained"
            buttonColor={theme.colors.error}
            textColor={theme.colors.onError}
            style={{ borderRadius: theme.roundness }}
            loading={cancelMutation.isPending}
            disabled={cancelMutation.isPending || !authUser?.subscription}
            onPress={() => cancelMutation.mutate()}
          >
            Cancelar Assinatura
          </Button>
        </View>
      </ScrollView>
    </FullScreenLayout>
  );
}
