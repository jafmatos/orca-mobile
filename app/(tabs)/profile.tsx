import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { SubscriptionPromoCard } from "@/components/profile/SubscriptionPromoCard";
import { AppAvatar } from "@/components/ui/AppAvatar";
import { AppBottomSheet, AppBottomSheetRef } from "@/components/ui/AppBottomSheet";
import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { useAppRouter } from "@/hooks/use-app-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAppToast } from "@/hooks/use-app-toast";
import { AvatarService } from "@/services/Api/Users/AvatarApiService";
import { ProfileService } from "@/services/Api/Users/ProfileApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useMemo, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppLayoutConstants } from "@/constants/layout";
import { Pressable, ScrollView, View } from "react-native";
import { Button, Icon, IconButton, Surface, Text } from "react-native-paper";
import { AppLogoutButton } from "@/components/ui/AppLogoutButton";

export default function ProfileScreen() {
  const authUserQuery = useAuthUser();
  const theme = useAppTheme();
  const router = useAppRouter();
  const toast = useAppToast();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const toastOffset = insets.top + AppLayoutConstants.headerHeight + AppLayoutConstants.toastBaseOffset;

  const authUser = useMemo(() => {
    return authUserQuery?.data?.user;
  }, [authUserQuery.data]);

  const avatarBottomSheetRef = useRef<AppBottomSheetRef>(null);

  const openAvatarBottomSheet = () => avatarBottomSheetRef.current?.open();
  const closeAvatarBottomSheet = () => avatarBottomSheetRef.current?.close();



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

      <ScrollView style={{ flex: 1 }} contentContainerClassName="p-4 flex gap-4" showsVerticalScrollIndicator={false}>
        <Surface className="relative" style={{ borderRadius: theme.roundness }}>
          <View className="p-4 flex flex-row items-center gap-4">
            <Pressable
              onPress={() => {
                openAvatarBottomSheet();
              }}
              className="relative"
            >
              <AppAvatar url={authUser?.avatar?.url} fallback={authUser?.name || "U"} size={60} />

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
                {authUser?.name || "Usuário"}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant, flexShrink: 1 }}
              >
                {authUser?.email || "email@exemplo.com"}
              </Text>
            </View>
          </View>

          <IconButton
            icon="pencil"
            size={20}
            onPress={() => router.goToProfileForm()}
            iconColor={theme.colors.onSurfaceVariant}
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              margin: 0,
            }}
          />
        </Surface>

        {authUser?.subscription ? (
          <Surface
            style={{
              borderRadius: theme.roundness,
              backgroundColor: theme.colors.primary,
            }}
            className="!p-0"
          >
            <View className="p-5 flex flex-col gap-3">
              <View className="flex flex-row justify-between items-center">
                <View className="flex flex-row items-center gap-2">
                  <Icon source="crown" size={24} color={theme.colors.onPrimary} />
                  <Text variant="titleMedium" style={{ fontWeight: "bold", color: theme.colors.onPrimary }}>
                    {authUser.subscription.plan.name}
                  </Text>
                </View>
              </View>

              <Text variant="bodyMedium" style={{ color: theme.colors.onPrimary }}>
                Sua assinatura está{" "}
                <Text variant="bodyMedium" style={{ fontWeight: "bold", color: theme.colors.onPrimary }}>
                  {authUser.subscription.traducedStatus.toLowerCase()}
                </Text>
              </Text>

              <Button
                mode="contained"
                buttonColor={theme.colors.primaryContainer}
                textColor={theme.colors.primary}
                className="mt-2"
                onPress={() => router.goToManageSubscription()}
                style={{ borderRadius: theme.roundness }}
              >
                Gerenciar Assinatura
              </Button>
            </View>
          </Surface>
        ) : (
          <SubscriptionPromoCard />
        )}


        <AppLogoutButton />
      </ScrollView>

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

          {authUser?.avatar?.url && (
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
