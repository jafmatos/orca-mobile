import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { ProfileFormOverlay, ProfileFormOverlayRef } from "@/components/profile/ProfileFormOverlay";
import { AppAvatar } from "@/components/ui/AppAvatar";
import { AppBottomSheet, AppBottomSheetRef } from "@/components/ui/AppBottomSheet";
import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { useAppRouter } from "@/hooks/use-app-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppToast } from "@/hooks/use-app-toast";
import { AvatarService } from "@/services/Api/Users/AvatarApiService";
import { ProfileService } from "@/services/Api/Users/ProfileApiService";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { subscribeToPushNotifications, unsubscribeToPushNotifications } from "@/utils/notifications";
import { QueryKeys } from "@/utils/QueryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppLayoutConstants } from "@/constants/layout";
import { Pressable, ScrollView, View } from "react-native";
import { Button, Icon, IconButton, Surface, Switch, Text } from "react-native-paper";

export default function ProfileScreen() {
  const user = useAuthUser();
  const theme = useAppTheme();
  const router = useAppRouter();
  const toast = useAppToast();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const toastOffset = insets.top + AppLayoutConstants.headerHeight + AppLayoutConstants.toastBaseOffset;

  const avatarBottomSheetRef = useRef<AppBottomSheetRef>(null);
  const profileFormOverlayRef = useRef<ProfileFormOverlayRef>(null);

  const openAvatarBottomSheet = () => avatarBottomSheetRef.current?.open();
  const closeAvatarBottomSheet = () => avatarBottomSheetRef.current?.close();
  const openProfileFormOverlay = () => profileFormOverlayRef.current?.open();
  const closeProfileFormOverlay = () => profileFormOverlayRef.current?.close();

  useEffect(() => {
    if (!user) return;

    profileFormOverlayRef.current?.form.setForm({
      name: user.name,
      email: user.email,
      periodReferenceDay: user.periodReferenceDay,
    });
  }, [user]);

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

  const uploadAvatarMutation = useMutation({
    mutationFn: (formData: FormData) => AvatarService.update(formData),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(QueryKeys.User.getAuthUser(), { user: updatedUser });

      queryClient.invalidateQueries({ queryKey: QueryKeys.User.getAuthUser() });
    },
    onError: (error: any) => {
      toast.error({
        title: "Ops...",
        description: error.response?.data?.message || error.message || "Erro ao atualizar avatar",
        topOffset: toastOffset,
      });
    },
  });

  const removeAvatarMutation = useMutation({
    mutationFn: () => AvatarService.remove(),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(QueryKeys.User.getAuthUser(), { user: updatedUser });
      queryClient.invalidateQueries({ queryKey: QueryKeys.User.getAuthUser() });
    },
    onError: (error: any) => {
      toast.error({
        title: "Ops...",
        description: error.response?.data?.message || error.message || "Erro ao remover avatar",
        topOffset: toastOffset,
      });
    },
  });

  const handlePickImage = async () => {
    avatarBottomSheetRef.current?.close();

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      toast.error({
        title: "Permissão necessária",
        description: "Precisamos de permissão para acessar a galeria.",
        topOffset: toastOffset,
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      uploadAvatar(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    avatarBottomSheetRef.current?.close();

    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      toast.error({
        title: "Permissão necessária",
        description: "Precisamos de permissão para usar a câmera.",
        topOffset: toastOffset,
      });

      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      uploadAvatar(result.assets[0].uri);
    }
  };

  const uploadAvatar = (uri: string) => {
    const filename = uri.split("/").pop() || "avatar.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();

    formData.append("avatar", {
      uri,
      name: filename,
      type,
    } as any);

    uploadAvatarMutation.mutate(formData);
  };

  return (
    <TabbedLayout>
      <Navigation hideCurrencyToggle />

      <ScrollView style={{ flex: 1 }} contentContainerClassName="p-4 flex gap-6" showsVerticalScrollIndicator={false}>
        <Surface className="!p-4 relative" style={{ borderRadius: theme.roundness }}>
          <View className="flex flex-row items-center gap-4">
            <Pressable
              onPress={() => {
                openAvatarBottomSheet();
              }}
              className="relative"
            >
              <AppAvatar url={user?.avatar?.url} fallback={user?.name || "U"} size={60} />

              <View
                style={{
                  position: "absolute",
                  right: -2,
                  bottom: -2,
                  backgroundColor: theme.colors.primary,
                  borderRadius: 9999,
                  padding: 4,
                }}
              >
                <Icon source="camera" size={12} color={theme.colors.onPrimary} />
              </View>
            </Pressable>

            <View className="flex-1 pr-5">
              <Text numberOfLines={1} ellipsizeMode="tail" variant="titleMedium" style={{ fontWeight: "bold", flexShrink: 1 }}>
                {user?.name || "Usuário"}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant, flexShrink: 1 }}
              >
                {user?.email || "email@exemplo.com"}
              </Text>
            </View>
          </View>

          <IconButton
            icon="pencil"
            size={20}
            onPress={openProfileFormOverlay}
            iconColor={theme.colors.onSurfaceVariant}
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              margin: 0,
            }}
          />
        </Surface>

        <View style={{ gap: 8 }}>
          <Text variant="titleMedium" style={{ fontWeight: "bold", paddingLeft: 4 }}>
            Configurações
          </Text>
          <Surface style={{ borderRadius: theme.roundness }} className="!p-4 flex flex-col gap-4">
            <View className="flex flex-row justify-between items-center">
              <View className="flex-1 pr-4">
                <Text variant="bodyLarge">Notificações</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Receber alertas e novidades da conta
                </Text>
              </View>

              <Switch
                value={user?.acceptsNotifications}
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
          </Surface>
        </View>

        <View style={{ gap: 8 }}>
          <Text variant="titleMedium" style={{ fontWeight: "bold", paddingLeft: 4 }}>
            Plano e Assinatura
          </Text>

          <Surface style={{ borderRadius: theme.roundness }} className="!p-4 flex flex-col gap-4">
            <View className="flex flex-row justify-between items-center">
              <View className="flex flex-row items-center gap-3">
                <Icon source="star-outline" size={20} color={theme.colors.primary} />
                <View>
                  <Text variant="bodyLarge">{user?.subscription ? user.subscription.plan.name : "Plano Gratuito"}</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {user?.subscription
                      ? `${user.subscription.traducedStatus} • ${currencyFormatter.format(user.subscription.plan.price)}/mês`
                      : "Recursos básicos de controle financeiro"}
                  </Text>
                </View>
              </View>

              {!user?.subscription && (
                <Button
                  mode="contained-tonal"
                  compact
                  onPress={() => console.log("Upgrade requested")}
                  style={{ borderRadius: theme.roundness }}
                >
                  Upgrade
                </Button>
              )}
            </View>
          </Surface>
        </View>

        <Button
          mode="contained"
          icon="logout"
          buttonColor={theme.colors.error}
          textColor={theme.colors.onError}
          style={{ borderRadius: theme.roundness }}
          onPress={() => {
            AppAuthenticationTokenStore.remove();

            router.goToSignIn();
          }}
        >
          Sair
        </Button>
      </ScrollView>

      <ProfileFormOverlay
        ref={profileFormOverlayRef}
        onSuccess={(user) => {
          queryClient.setQueryData(QueryKeys.User.getAuthUser(), { user });

          queryClient.invalidateQueries({ queryKey: QueryKeys.User.getAuthUser() });
          closeProfileFormOverlay();
        }}
      />

      <AppBottomSheet imperative ref={avatarBottomSheetRef}>
        <View className="flex flex-col gap-4 items-center">
          <Text variant="titleMedium" className="text-center">
            Foto de Perfil
          </Text>

          <Button className="w-full" mode="outlined" icon="camera" onPress={handleTakePhoto}>
            Tirar Foto
          </Button>

          <Button className="w-full" mode="outlined" icon="image-multiple" onPress={handlePickImage}>
            Escolher da Galeria
          </Button>

          {user?.avatar?.url && (
            <Button
              className="w-full"
              mode="contained"
              icon="trash-can"
              buttonColor={theme.colors.error}
              textColor={theme.colors.onError}
              onPress={() => removeAvatarMutation.mutate()}
              loading={removeAvatarMutation.isPending}
              disabled={removeAvatarMutation.isPending}
            >
              Remover Foto Atual
            </Button>
          )}
        </View>
      </AppBottomSheet>
    </TabbedLayout>
  );
}
