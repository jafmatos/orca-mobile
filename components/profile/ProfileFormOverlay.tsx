import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import React, { useImperativeHandle, useMemo } from "react";
import { View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import { AppFullScreenOverlay, AppFullScreenOverlayProps, AppFullScreenOverlayRef } from "../ui/AppFullScreenOverlay";
import { FormField } from "../ui/FormField";
import { AppSelect } from "../ui/AppSelect";
import { User } from "@/models/User";
import { ProfileService, UpdateProfileArguments, UpdateProfileReturnType } from "@/services/Users/ProfileService";

export interface UpdateProfileForm {
  name: string;
  email: string;
  periodReferenceDay: number;
}

export interface ProfileOverlayProps extends Omit<AppFullScreenOverlayProps, "title"> {
  onSuccess?: (user: User) => void;
}

export interface ProfileFormOverlayRef extends AppFullScreenOverlayRef {
  form: ReturnType<typeof useAppForm<UpdateProfileForm>>;
}

export const ProfileFormOverlay = React.forwardRef<ProfileFormOverlayRef, ProfileOverlayProps>(function ProfileForm(
  props: ProfileOverlayProps,
  ref,
) {
  const categoryFormRef = React.useRef<AppFullScreenOverlayRef>(null);

  const profileForm = useAppForm<UpdateProfileForm>({
    name: "",
    email: "",
    periodReferenceDay: 1,
  });

  useImperativeHandle(ref, () => {
    return {
      open: () => categoryFormRef.current?.open(),
      close: () => categoryFormRef.current?.close(),
      form: profileForm,
    };
  });

  const { mutation: profileUpdateMutation } = useAppFormWithMutation<UpdateProfileForm, UpdateProfileArguments, UpdateProfileReturnType>(
    profileForm,
    {
      mutationFn: (body) => ProfileService.update(body),
      onSuccess: (data) => {
        props.onSuccess?.(data.user);
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
    <AppFullScreenOverlay ref={categoryFormRef} title="Editar Perfil">
      <View className="p-4 flex flex-col gap-2">
        <FormField>
          <TextInput
            mode="outlined"
            label="Nome*"
            autoCapitalize="words"
            value={profileForm.values.name}
            onChangeText={profileForm.makeSetter("name")}
          />

          <HelperText type="error" visible={profileForm.hasError("name")}>
            {profileForm.getError("name")}
          </HelperText>
        </FormField>

        <FormField>
          <TextInput mode="outlined" label="E-mail*" value={profileForm.values.email} onChangeText={profileForm.makeSetter("email")} />

          <HelperText type="error" visible={profileForm.hasError("email")}>
            {profileForm.getError("email")}
          </HelperText>
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

          <HelperText type="error" visible={profileForm.hasError("periodReferenceDay")}>
            {profileForm.getError("periodReferenceDay")}
          </HelperText>
        </FormField>

        <Button
          mode="contained"
          onPress={() => profileUpdateMutation.mutateAsync(profileForm.values)}
          loading={profileUpdateMutation.isPending}
          disabled={profileUpdateMutation.isPending || profileForm.hasErrors}
        >
          Salvar
        </Button>
      </View>
    </AppFullScreenOverlay>
  );
});
