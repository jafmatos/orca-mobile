import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { useAppRouter } from "@/hooks/use-app-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { View } from "react-native";
import { Button, Icon, Text } from "react-native-paper";

export default function SubscriptionSuccessScreen() {
  const theme = useAppTheme();
  const router = useAppRouter();

  return (
    <FullScreenLayout>
      <View className="flex-1 justify-center items-center p-6 gap-6">
        <Icon source="crown" size={80} color={theme.colors.primary} />

        <View className="flex flex-col gap-2 items-center">
          <Text variant="headlineSmall" style={{ fontWeight: "bold", textAlign: "center", color: theme.colors.onBackground }}>
            Assinatura Concluída!
          </Text>
          <Text variant="bodyLarge" style={{ textAlign: "center", color: theme.colors.onSurfaceVariant }}>
            Parabéns! Sua assinatura foi ativada com sucesso. Você agora tem acesso a todos os recursos premium.
          </Text>
        </View>

        <Button mode="contained" className="w-full mt-6" onPress={() => router.goToHome()}>
          Voltar para o Início
        </Button>
      </View>
    </FullScreenLayout>
  );
}
