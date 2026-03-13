import { AppFormField } from "@/components/AppFormField";
import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { ButtonWithLoading } from "@/components/ui/ButtonWithLoading";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { CreateAuthenticationTokenArguments, CreateAuthenticationTokenReturnType, SignInService } from "@/services/Auth/SignInService";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import { ButtonText, FormControlHelper, FormControlHelperText, Heading, Link, Text } from "@gluestack-ui/themed";
import { Href, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

type SignInForm = {
  email: string;
  password: string;
};

export default function SignInScreen() {
  const router = useRouter();
  const form = useAppForm<SignInForm>({ email: "", password: "" });

  const {
    hasErrors,
    setValue,
    getError,
    hasError,
    mutation: createTokenMutation,
  } = useAppFormWithMutation<SignInForm, CreateAuthenticationTokenArguments, CreateAuthenticationTokenReturnType>(form, {
    mutationFn: SignInService.createAuthenticationToken,
    onSuccess: (data) => {
      form.clear();

      AppAuthenticationTokenStore.set(data.token);

      router.push("/(tabs)");
    },
  });

  return (
    <FullScreenLayout>
      <View className="w-screen h-full p-6 flex flex-col justify-center items-start">
        <View className="flex flex-col gap-2">
          <Heading size="3xl" className="!text-typography-100 !font-semibold">
            Entrar
          </Heading>
          <Text marginBottom="$2" className="!text-typography-200">
            Acesse sua conta e acompanhe suas finanças de forma simples e segura.
          </Text>
          <View className="flex gap-2">
            <AppFormField isRequired isInvalid={hasError("email")}>
              <AppFormField.Label className="!text-typography-200 !font-medium">Email</AppFormField.Label>
              <AppFormField.TextInput
                value={form.values.email}
                placeholder="Digite seu e-mail"
                textContentType="emailAddress"
                onChangeText={(text) => setValue("email", text)}
                required
              />
              <AppFormField.Error error={getError("email")} />
            </AppFormField>
            <AppFormField isRequired isInvalid={hasError("password")}>
              <AppFormField.Label className="!text-typography-200 !font-medium">Senha</AppFormField.Label>
              <AppFormField.TextInput
                value={form.values.password}
                placeholder="Digite sua senha"
                textContentType="password"
                onChangeText={(text) => setValue("password", text)}
                secureTextEntry
                required
              />
              <AppFormField.Error error={getError("password")} />
              <FormControlHelper>
                <FormControlHelperText>
                  <Link onPress={() => router.push("/(auth)/reset-password" as Href)}>
                    <Text size="sm" className="!text-typography-400">
                      Esqueceu a senha?
                    </Text>
                  </Link>
                </FormControlHelperText>
              </FormControlHelper>
            </AppFormField>
            <ButtonWithLoading
              onPress={() => createTokenMutation.mutateAsync(form.values)}
              isDisabled={createTokenMutation.isPending || hasErrors}
              isLoading={createTokenMutation.isPending}
              spinnerColor="$primary500"
              action="primary"
            >
              <ButtonText color="$onPrimary">Entrar</ButtonText>
            </ButtonWithLoading>
          </View>
          <View className="mt-2 flex flex-row gap-0 self-center">
            <Text className="flex items-center !text-typography-400" size="sm">
              Não tem uma conta?{" "}
            </Text>
            <Link onPress={() => router.push("/(auth)/sign-up")}>
              <Text color="$info500" size="sm">
                Cadastre-se
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </FullScreenLayout>
  );
}
