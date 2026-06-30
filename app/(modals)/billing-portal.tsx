import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { AppModalHeader } from "@/components/ui/AppModalHeader";
import { BillingPortalApiService, CreateBillingPortalUIMode } from "@/services/Api/BillingPortalApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppToast } from "@/hooks/use-app-toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppLayoutConstants } from "@/constants/layout";

export default function BillingPortalScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useAppTheme();
  const toast = useAppToast();
  const insets = useSafeAreaInsets();
  const toastOffset = insets.top + AppLayoutConstants.headerHeight + AppLayoutConstants.toastBaseOffset;

  const [billingPortalUrl, setBillingPortalUrl] = useState<string | null>(null);

  const portalMutation = useMutation({
    mutationFn: () =>
      BillingPortalApiService.createUrl({
        ui_mode: CreateBillingPortalUIMode.Hosted,
        returnUrl: "https://local.app/stripe/return",
      }),
    onSuccess: (data) => {
      setBillingPortalUrl(data.session.url);
    },
    onError: (error: any) => {
      toast.error({
        title: "Ops...",
        description: error.response?.data?.message || error.message || "Erro ao acessar o portal da assinatura",
        topOffset: toastOffset,
      });
      router.back();
    },
  });

  useEffect(() => {
    portalMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FullScreenLayout>
      {!billingPortalUrl && <AppModalHeader title="Portal de Assinatura" />}
      
      {billingPortalUrl ? (
        <WebView
          source={{ uri: billingPortalUrl }}
          style={{ flex: 1 }}
          onShouldStartLoadWithRequest={(request) => {
            if (request.url.includes("local.app/stripe/return")) {
              setBillingPortalUrl(null);
              queryClient.invalidateQueries({ queryKey: QueryKeys.User.getAuthUser() });
              router.back();
              return false;
            }
            return true;
          }}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
    </FullScreenLayout>
  );
}
