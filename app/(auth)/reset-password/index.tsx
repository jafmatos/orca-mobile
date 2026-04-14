import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { FormField } from "@/components/ui/FormField";
import { websiteUrl } from "@/constants/website-url";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { useAppRouter } from "@/hooks/use-app-router";
import {
	CreateResetPasswordKeyArguments,
	CreateResetPasswordKeyReturnType,
	ResetPasswordService,
} from "@/services/Auth/ResetPasswordService";
import { View } from "react-native";
import { Button, HelperText, Text, TextInput, useTheme } from "react-native-paper";

type ResetPasswordForm = {
  email: string;
};

export default function ResetPasswordScreen() {
  const theme = useTheme();
  const router = useAppRouter();
  const form = useAppForm<ResetPasswordForm>({
    email: "",
  });

  const { mutation: createResetPasswordKeyMutation } = useAppFormWithMutation<
    ResetPasswordForm,
    CreateResetPasswordKeyArguments,
    CreateResetPasswordKeyReturnType
  >(form, {
    mutationFn: ResetPasswordService.createResetPasswordKey,
    onSuccess: (data) => {
      router.goToResetPasswordConfirm(data.key.id);
    },
  });

  return (
    <FullScreenLayout>
      <View className="w-screen h-full p-6 flex flex-col justify-center">
        <View className="flex flex-col gap-2">
          <Text variant="headlineMedium">Recuperar senha</Text>
          <Text variant="bodyMedium">Esqueceu a senha? Acontece. Digite seu e-mail abaixo e te ajudaremos a recuperar o acesso.</Text>
          <View className="flex gap-2">
            <FormField>
              <TextInput
                label="Email*"
                placeholder="Digite seu email"
                mode="outlined"
                keyboardType="email-address"
                value={form.values.email}
                onChangeText={form.makeSetter("email")}
                error={form.hasError("email")}
              />
              <HelperText type="error" visible={form.hasError("email")}>
                {form.getError("email")}
              </HelperText>
            </FormField>

            <Button
              mode="contained"
              onPress={() =>
                createResetPasswordKeyMutation.mutateAsync({
                  ...form.values,
                  confirmUrl: websiteUrl,
                })
              }
              disabled={createResetPasswordKeyMutation.isPending || form.hasErrors}
              loading={createResetPasswordKeyMutation.isPending}
            >
              Enviar
            </Button>
          </View>

          <View className="mt-2 flex flex-row gap-0 self-center">
            <Text variant="bodyMedium">Voltar para o </Text>
            <Text variant="bodyMedium" onPress={() => router.goToSignIn()} style={{ color: theme.colors.primary }}>
              login
            </Text>
          </View>
        </View>
      </View>
    </FullScreenLayout>
  );
}
