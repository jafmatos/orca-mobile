import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppToast } from "@/hooks/use-app-toast";
import { ProfileService } from "@/services/Api/Users/ProfileApiService";
import { subscribeToPushNotifications, unsubscribeToPushNotifications } from "@/utils/notifications";
import { QueryKeys } from "@/utils/QueryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { Switch, Text } from "react-native-paper";
import { AppDropdownSelect } from "@/components/ui/AppDropdownSelect";
import { useThemePreference } from "@/hooks/use-theme-preference";
import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { AppLayoutConstants } from "@/constants/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppModalHeader } from "@/components/ui/AppModalHeader";

export default function SettingsScreen() {
  const authUserQuery = useAuthUser();
  const theme = useAppTheme();
  const queryClient = useQueryClient();
  const toast = useAppToast();
  const insets = useSafeAreaInsets();
  const toastOffset = insets.top + AppLayoutConstants.headerHeight + AppLayoutConstants.toastBaseOffset;
  const { preference, setPreference } = useThemePreference();

  const authUser = useMemo(() => {
    return authUserQuery.data?.user;
  }, [authUserQuery.data]);

  const updateAcceptsNotificationsMutation = useMutation({
    mutationFn: (args: { acceptsNotifications: boolean }) => ProfileService.update(args),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(QueryKeys.User.getAuthUser(), { user });
    },
    onError: (error: any) => {
      toast.error({
        title: "Ops...",
        description: error.response?.data?.message || error.message || "Erro ao atualizar perfil",
        topOffset: toastOffset,
      });
    },
  });

  return (
    <FullScreenLayout>
      <AppModalHeader title="Configurações" />

      <ScrollView className="p-4" contentContainerStyle={{ gap: 24 }}>
        <View style={{ gap: 8 }}>
          <View className="flex flex-col gap-4 px-1">
            <View className="flex flex-row justify-between items-center">
              <View className="flex-1 pr-4">
                <Text variant="bodyLarge">Notificações</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Receber alertas e novidades da conta
                </Text>
              </View>

              <Switch
                value={authUser?.acceptsNotifications}
                onValueChange={async (value) => {
                  try {
                    if (value) {
                      await subscribeToPushNotifications();
                    } else {
                      await unsubscribeToPushNotifications();
                    }
                  } catch (error: any) {
                    console.log(error.response?.data?.message || error.message);
                  } finally {
                    updateAcceptsNotificationsMutation.mutate({ acceptsNotifications: value });
                  }
                }}
                disabled={updateAcceptsNotificationsMutation.isPending}
                color={theme.colors.primary}
              />
            </View>
          </View>

          <View className="flex flex-col gap-4 px-1 mt-4">
            <View className="flex flex-row justify-between items-center">
              <View className="flex-1 pr-4">
                <Text variant="bodyLarge">Tema</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Aparência do aplicativo
                </Text>
              </View>

              <AppDropdownSelect
                variant="text"
                value={preference}
                onChange={(value) => setPreference(value as any)}
                options={[
                  { value: "system", label: "Sistema" },
                  { value: "light", label: "Claro" },
                  { value: "dark", label: "Escuro" },
                ]}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </FullScreenLayout>
  );
}
