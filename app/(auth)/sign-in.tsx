import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { AppSecureInput } from "@/components/ui/AppSecureInput";
import { FormField } from "@/components/ui/FormField";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { useAppRouter } from "@/hooks/use-app-router";
import {
  CreateAuthenticationTokenArguments,
  CreateAuthenticationTokenReturnType,
  SignInService,
} from "@/services/Api/Users/Auth/SignInApiService";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import React from "react";
import { View } from "react-native";
import { Button, HelperText, Text, useTheme } from "react-native-paper";
import { AppTextInput } from "@/components/ui/AppTextInput";
import { AppKeyboardDismissing } from "@/components/ui/AppKeyboardDismissing";

type SignInForm = {
  email: string;
  password: string;
};

export default function SignInScreen() {
  const router = useAppRouter();
  const theme = useTheme();
  const form = useAppForm<SignInForm>({ email: "", password: "" });

  const { mutation: createTokenMutation } = useAppFormWithMutation<
    SignInForm,
    CreateAuthenticationTokenArguments,
    CreateAuthenticationTokenReturnType
  >(form, {
    mutationFn: SignInService.createAuthenticationToken,
    onSuccess: (data) => {
      form.clear();

      AppAuthenticationTokenStore.set(data.token);

      router.goToHome();
    },
  });

  return (
    <FullScreenLayout>
      <AppKeyboardDismissing.ScrollView>
        <View className="p-4 flex flex-col justify-center min-h-full">
          <View className="flex flex-col gap-2">
            <Text variant="headlineMedium">Entrar</Text>
            <Text variant="bodyMedium">Acesse sua conta e acompanhe suas finanças de forma simples e segura.</Text>

            <View className="flex gap-4">
              <FormField>
                <AppTextInput
                  label="Email*"
                  placeholder="Digite seu email"
                  mode="outlined"
                  keyboardType="email-address"
                  value={form.values.email}
                  onChangeText={form.makeSetter("email")}
                  error={form.hasError("email")}
                />
                {form.hasError("email") && (
                  <HelperText type="error" visible={true}>
                    {form.getError("email")}
                  </HelperText>
                )}
              </FormField>

              <FormField>
                <AppSecureInput
                  label="Senha*"
                  placeholder="Digite sua senha"
                  value={form.values.password}
                  onChangeText={form.makeSetter("password")}
                  error={form.hasError("password")}
                  mode="outlined"
                />
                <View className="flex flex-row items-center justify-between">
                  {form.hasError("password") && (
                    <HelperText type="error" visible={true}>
                      {form.getError("password")}
                    </HelperText>
                  )}

                  <HelperText type="info" visible onPress={() => router.goToResetPassword()}>
                    Esqueceu a senha?
                  </HelperText>
                </View>
              </FormField>

              <Button
                className="mt-2"
                mode="contained"
                onPress={() => createTokenMutation.mutateAsync(form.values)}
                disabled={createTokenMutation.isPending || form.hasErrors}
                loading={createTokenMutation.isPending}
              >
                Entrar
              </Button>
            </View>

            <View className="mt-2 flex flex-row gap-0 self-center">
              <Text variant="bodyMedium">Não tem uma conta? </Text>
              <Text variant="bodyMedium" onPress={() => router.goToSignUp()} style={{ color: theme.colors.primary }}>
                Cadastre-se
              </Text>
            </View>
          </View>
        </View>
      </AppKeyboardDismissing.ScrollView>
    </FullScreenLayout>
  );
}
