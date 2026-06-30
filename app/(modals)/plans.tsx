import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { AppModalHeader } from "@/components/ui/AppModalHeader";
import { useAppTheme } from "@/hooks/use-app-theme";
import { PlanApiService } from "@/services/Api/PlanApiService";
import { CheckoutApiService, CreateCheckoutUIMode } from "@/services/Api/CheckoutApiService";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { QueryKeys } from "@/utils/QueryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import { Text, Surface, Divider, Icon, Button } from "react-native-paper";
import { useAppToast } from "@/hooks/use-app-toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppLayoutConstants } from "@/constants/layout";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";

export default function PlansScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useAppToast();
  const insets = useSafeAreaInsets();
  const toastOffset = insets.top + AppLayoutConstants.headerHeight + AppLayoutConstants.toastBaseOffset;

  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const plansQuery = useQuery({
    queryKey: ["plans"],
    queryFn: () => PlanApiService.getPlans(),
  });

  const checkoutMutation = useMutation({
    mutationFn: (planId: string) =>
      CheckoutApiService.createUrl({
        planId,
        ui_mode: CreateCheckoutUIMode.Hosted,
        success_url: "https://local.app/stripe/success",
        cancel_url: "https://local.app/stripe/cancel",
      }),
    onSuccess: (data) => {
      setCheckoutUrl(data.session.url);
    },
    onError: (error: any) => {
      toast.error({
        title: "Erro",
        description: error.response?.data?.message || error.message || "Erro ao iniciar o checkout",
        topOffset: toastOffset,
      });
    },
  });

  if (checkoutUrl) {
    return (
      <FullScreenLayout>
        <WebView
          source={{ uri: checkoutUrl }}
          style={{ flex: 1 }}
          onShouldStartLoadWithRequest={(request) => {
            if (request.url.includes("local.app/stripe/success")) {
              setCheckoutUrl(null);

              queryClient.invalidateQueries({ queryKey: QueryKeys.User.getAuthUser() });

              router.replace("/(modals)/subscription-success");
              return false;
            } else if (request.url.includes("local.app/stripe/cancel")) {
              setCheckoutUrl(null);

              return false;
            }

            return true;
          }}
        />
      </FullScreenLayout>
    );
  }

  return (
    <FullScreenLayout>
      <AppModalHeader title="Planos" />

      <ScrollView className="p-4" contentContainerStyle={{ gap: 24, paddingBottom: insets.bottom + 24 }}>
        {plansQuery.isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
          plansQuery.data?.plans?.map((plan) => (
            <Surface key={plan.id}>
              <View style={{ borderRadius: theme.roundness, overflow: "hidden" }}>
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.tertiary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ padding: 20, alignItems: "center" }}
                >
                  <Icon source="crown" size={32} color={theme.colors.onPrimary} />

                  <Text variant="titleLarge" style={{ fontWeight: "bold", color: theme.colors.onPrimary, marginTop: 8 }}>
                    {plan.name}
                  </Text>
                </LinearGradient>

                <View style={{ padding: 24, alignItems: "center" }}>
                  <Text variant="displaySmall" style={{ fontWeight: "900", color: theme.colors.primary, letterSpacing: -1 }}>
                    {currencyFormatter.format(plan.price)}
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: "normal" }}>
                      /mês
                    </Text>
                  </Text>

                  <Divider style={{ width: "100%", marginVertical: 20 }} />

                  <View style={{ width: "100%", gap: 12 }}>
                    {plan.benefits &&
                      plan.benefits.length > 0 &&
                      plan.benefits.map((benefit, index) => (
                        <View key={index} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <Icon source="check-circle" size={22} color={theme.colors.primary} />
                          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, flexShrink: 1, fontWeight: "500" }}>
                            {benefit}
                          </Text>
                        </View>
                      ))}
                  </View>

                  <Button
                    mode="contained"
                    style={{ width: "100%", marginTop: 28, padding: 0, height: 48, borderRadius: 24 }}
                    contentStyle={{ height: 48 }}
                    labelStyle={{ fontSize: 16, fontWeight: "bold" }}
                    loading={checkoutMutation.isPending && checkoutMutation.variables === plan.id}
                    disabled={checkoutMutation.isPending}
                    onPress={() => checkoutMutation.mutate(plan.id)}
                  >
                    Assinar Agora
                  </Button>
                </View>
              </View>
            </Surface>
          ))
        )}
      </ScrollView>
    </FullScreenLayout>
  );
}
