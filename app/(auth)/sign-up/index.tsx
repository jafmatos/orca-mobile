import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { AppSecureInput } from "@/components/ui/AppSecureInput";
import { FormField } from "@/components/ui/FormField";
import { websiteUrl } from "@/constants/website-url";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { useAppRouter } from "@/hooks/use-app-router";
import { CreateSignUpKeyArguments, CreateSignUpKeyReturnType, SignUpService } from "@/services/Auth/SignUpService";
import { Pressable, View } from "react-native";
import { Button, Checkbox, HelperText, Text, TextInput, useTheme } from "react-native-paper";

type SignUpForm = {
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
  acceptedTerms: boolean;
};

export default function SignUpScreen() {
  const router = useAppRouter();
  const theme = useTheme();
  const form = useAppForm<SignUpForm>({
    email: "",
    name: "",
    password: "",
    passwordConfirmation: "",
    acceptedTerms: false,
  });

  const { mutation: createSignUpKeyMutation } = useAppFormWithMutation<SignUpForm, CreateSignUpKeyArguments, CreateSignUpKeyReturnType>(
    form,
    {
      mutationFn: SignUpService.createSignUpKey,
      onSuccess: (data) => {
        router.goToSignUpConfirm(data.key.id);
      },
    },
  );

  return (
    <FullScreenLayout>
      <View className="w-screen h-full p-4 flex flex-col justify-center">
        <View className="flex flex-col gap-2">
          <Text variant="headlineMedium">Cadastrar-se</Text>
          <Text variant="bodyMedium">Junte-se a nós e comece a gerenciar suas finanças de forma simples e segura.</Text>
          <View className="flex gap-2">
            <FormField>
              <TextInput
                label="Nome*"
                placeholder="Digite seu nome"
                mode="outlined"
                value={form.values.name}
                textContentType="name"
                onChangeText={form.makeSetter("name")}
                error={form.hasError("name")}
              />
              <HelperText type="error" visible={form.hasError("name")}>
                {form.getError("name")}
              </HelperText>
            </FormField>

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
              <HelperText type="error" visible={form.hasError("password")}>
                {form.getError("password")}
              </HelperText>
            </FormField>

            <FormField>
              <AppSecureInput
                mode="outlined"
                label="Confirmação da senha*"
                placeholder="Confirme sua senha"
                value={form.values.passwordConfirmation}
                onChangeText={form.makeSetter("passwordConfirmation")}
                error={form.hasError("passwordConfirmation") || form.values.password !== form.values.passwordConfirmation}
              />
              <HelperText
                type="error"
                visible={form.hasError("passwordConfirmation") || form.values.password !== form.values.passwordConfirmation}
              >
                {form.getError("passwordConfirmation") || "As senhas não coincidem"}
              </HelperText>
            </FormField>

            <Pressable
              className="flex flex-row items-center"
              onPress={() => {
                form.setValue("acceptedTerms", !form.values.acceptedTerms);
              }}
            >
              <Checkbox status={form.values.acceptedTerms ? "checked" : "unchecked"} />
              <Text variant="bodyMedium">Eu li e aceito os termos de uso</Text>
            </Pressable>

            <Button
              mode="contained"
              onPress={() =>
                createSignUpKeyMutation.mutateAsync({
                  ...form.values,
                  confirmUrl: websiteUrl,
                })
              }
              disabled={!form.values.acceptedTerms || form.hasErrors || createSignUpKeyMutation.isPending}
              loading={createSignUpKeyMutation.isPending}
            >
              Enviar
            </Button>
          </View>
          <View className="mt-2 flex flex-row gap-0 self-center">
            <Text variant="bodyMedium">Já tem uma conta? </Text>
            <Text variant="bodyMedium" onPress={() => router.goToSignIn()} style={{ color: theme.colors.primary }}>
              Entrar
            </Text>
          </View>
        </View>
      </View>
    </FullScreenLayout>
  );
}
