import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { BelvoWidgetTokenApiService } from "@/services/Api/OpenFinance/BelvoWidgetTokenApiService";
import { useMutation } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { useState } from "react";
import { Modal, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { WebView } from "react-native-webview";

export default function OpenFinanceLinksScreen() {
  const [widgetToken, setWidgetToken] = useState<string | null>(null);

  const createTokenMutation = useMutation({
    mutationFn: async () => {
      const data = await BelvoWidgetTokenApiService.create({
        stale_in: "42d",
        widget: {
          openfinance_feature: "consent_link_creation",
          callback_urls: {
            application_link: "https://orca-financas.com",
            success: "https://orca-financas.com",
            exit: "https://orca-financas.com",
            event: "https://orca-financas.com",
          },
          branding: {
            company_icon: "https://orca-financas.com/logo/wordmark-primary.svg",
            company_logo: "https://orca-financas.com/logo/wordmark-primary.svg",
            company_name: "Orça",
            overlay_background_color: "#F0F2F4",
            social_proof: true,
            show_belvo_middle_logo: false,
          },
          theme: [
            {
              css_key: "--color-primary-base",
              value: "#f28507",
            },
          ],
          consent: {
            purpose: "Análise de movimentações para organização de finanças pessoais.",
            terms_and_conditions_url: "https://orca-financas.com/termos-de-uso",
            permissions: ["REGISTER", "ACCOUNTS", "CREDIT_CARDS", "CREDIT_OPERATIONS"],
            default_consent_duration_days: 183,
            identification_info: [
              {
                type: "CPF",
                number: "12345678909",
                name: "José",
              },
            ],
          },
        },
      });

      setWidgetToken(data.access);
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Erro ao iniciar o Widget",
        text2: "Não foi possível carregar o token da Belvo.",
      });
      console.log(error);
    },
  });

  if (widgetToken) {
    return (
      <Modal visible={true} animationType="slide" onRequestClose={() => setWidgetToken(null)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          <WebView
            source={{ uri: `https://widget.belvo.io/?access_token=${widgetToken}&locale=pt&integration_type=openfinance` }}
            style={{ flex: 1 }}
            originWhitelist={["*"]}
            onShouldStartLoadWithRequest={(request) => {
              if (request.url.includes("orca://")) {
                const parsedUrl = Linking.parse(request.url);
                const route = parsedUrl.hostname || parsedUrl.path;
                const linkId = parsedUrl.queryParams?.link;

                if (route === "success" || linkId) {
                  console.log("Success! Link ID:", linkId);

                  Toast.show({
                    type: "success",
                    text1: "Conectado com sucesso!",
                    text2: "A instituição foi vinculada à sua conta.",
                  });

                  setWidgetToken(null);
                } else if (route === "exit" || request.url.includes("exit")) {
                  setWidgetToken(null);
                }

                return false;
              }

              return true;
            }}
          />
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <TabbedLayout>
      <Navigation />

      <View style={{ padding: 16 }}>
        <Button mode="contained" onPress={() => createTokenMutation.mutate()} loading={createTokenMutation.isPending}>
          Adicionar Conexão (Widget)
        </Button>
      </View>
    </TabbedLayout>
  );
}
