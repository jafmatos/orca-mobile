import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { AppFormField } from "@/components/ui/AppFormField";
import { AppModalHeader } from "@/components/ui/AppModalHeader";
import { AppSelect } from "@/components/ui/AppSelect";
import { AppTextInput } from "@/components/ui/AppTextInput";
import { AppKeyboardDismissing } from "@/components/utils/AppKeyboardDismissing";
import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { ProfileService, UpdateProfileArguments, UpdateProfileReturnType } from "@/services/Api/Users/ProfileApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import { Button, HelperText } from "react-native-paper";

export interface UpdateProfileForm {
  name: string;
  email: string;
  salaryDay: number;
}

export default function ProfileFormScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const authUserQuery = useAuthUser();
  const user = authUserQuery.data?.user;

  const profileForm = useAppForm<UpdateProfileForm>({
    name: "",
    email: "",
    salaryDay: 1,
  });

  useEffect(() => {
    if (!user) return;

    profileForm.setForm({
      name: user.name,
      email: user.email,
      salaryDay: user.salaryDay,
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
          <AppFormField>
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
          </AppFormField>

          <AppFormField>
            <AppTextInput mode="outlined" label="E-mail*" value={profileForm.values.email} onChangeText={profileForm.makeSetter("email")} />

            {profileForm.hasError("email") && (
              <HelperText type="error" visible={true}>
                {profileForm.getError("email")}
              </HelperText>
            )}
          </AppFormField>

          <AppFormField>
            <AppSelect
              closeOnSelect
              mode="outlined"
              label="Dia do Salário*"
              value={String(profileForm.values.salaryDay)}
              options={dayOptions}
              onChange={(value) => profileForm.setValue("salaryDay", Number(value))}
            />

            {profileForm.hasError("salaryDay") && (
              <HelperText type="error" visible={true}>
                {profileForm.getError("salaryDay")}
              </HelperText>
            )}
          </AppFormField>

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
