import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { User } from "@/models/User";
import { ProfileService, UpdateProfileArguments, UpdateProfileReturnType } from "@/services/Api/Users/ProfileApiService";
import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import { Button, HelperText } from "react-native-paper";
import { AppTextInput } from "@/components/ui/AppTextInput";
import { AppSelect } from "@/components/ui/AppSelect";
import { FormField } from "@/components/ui/FormField";
import { AppKeyboardDismissing } from "@/components/ui/AppKeyboardDismissing";
import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { AppModalHeader } from "@/components/ui/AppModalHeader";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/utils/QueryKeys";
import { useAuthUser } from "@/hooks/queries/use-auth-user";

export interface UpdateProfileForm {
  name: string;
  email: string;
  periodReferenceDay: number;
}

export default function ProfileFormScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const authUserQuery = useAuthUser();
  const user = authUserQuery.data?.user;

  const profileForm = useAppForm<UpdateProfileForm>({
    name: "",
    email: "",
    periodReferenceDay: 1,
  });

  useEffect(() => {
    if (!user) return;

    profileForm.setForm({
      name: user.name,
      email: user.email,
      periodReferenceDay: user.periodReferenceDay,
    });
  }, [user]);

  const { mutation: profileUpdateMutation } = useAppFormWithMutation<UpdateProfileForm, UpdateProfileArguments, UpdateProfileReturnType>(
    profileForm,
    {
      mutationFn: (body) => ProfileService.update(body),
      onSuccess: (data) => {
        queryClient.setQueryData(QueryKeys.User.getAuthUser(), { user: data.user });
        queryClient.invalidateQueries({ queryKey: QueryKeys.User.getAuthUser() });
        router.back();
      },
    },
  );

  const dayOptions = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      label: `Dia ${i + 1}`,
      value: String(i + 1),
    }));
  }, []);

  return (
    <FullScreenLayout>
      <AppModalHeader title="Editar Perfil" />
      <AppKeyboardDismissing.ScrollView>
        <View className="p-4 flex flex-col gap-4">
          <FormField>
            <AppTextInput
              mode="outlined"
              label="Nome*"
              autoCapitalize="words"
              value={profileForm.values.name}
              onChangeText={profileForm.makeSetter("name")}
            />

            {profileForm.hasError("name") && (
              <HelperText type="error" visible={true}>
                {profileForm.getError("name")}
              </HelperText>
            )}
          </FormField>

          <FormField>
            <AppTextInput mode="outlined" label="E-mail*" value={profileForm.values.email} onChangeText={profileForm.makeSetter("email")} />

            {profileForm.hasError("email") && (
              <HelperText type="error" visible={true}>
                {profileForm.getError("email")}
              </HelperText>
            )}
          </FormField>

          <FormField>
            <AppSelect
              closeOnSelect
              mode="outlined"
              label="Dia do Salário*"
              value={String(profileForm.values.periodReferenceDay)}
              options={dayOptions}
              onChange={(value) => profileForm.setValue("periodReferenceDay", Number(value))}
            />

            {profileForm.hasError("periodReferenceDay") && (
              <HelperText type="error" visible={true}>
                {profileForm.getError("periodReferenceDay")}
              </HelperText>
            )}
          </FormField>

          <Button
            className="mt-2"
            mode="contained"
            onPress={() => profileUpdateMutation.mutateAsync(profileForm.values)}
            loading={profileUpdateMutation.isPending}
            disabled={profileUpdateMutation.isPending || profileForm.hasErrors}
          >
            Salvar
          </Button>
        </View>
      </AppKeyboardDismissing.ScrollView>
    </FullScreenLayout>
  );
}
