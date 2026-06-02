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
} from "@/services/Users/Auth/SignInService";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import React from "react";
import { View } from "react-native";
import { Button, HelperText, Text, TextInput, useTheme } from "react-native-paper";

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
      <View className="p-4 w-screen h-full flex flex-col justify-center">
        <View className="flex flex-col gap-2">
          <Text variant="headlineMedium">Entrar</Text>
          <Text variant="bodyMedium">Acesse sua conta e acompanhe suas finanças de forma simples e segura.</Text>
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
                <HelperText type="error" visible={form.hasError("password")}>
                  {form.getError("password")}
                </HelperText>

                <HelperText type="info" visible onPress={() => router.goToResetPassword()}>
                  Esqueceu a senha?
                </HelperText>
              </View>
            </FormField>

            <Button
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
    </FullScreenLayout>
  );
}
