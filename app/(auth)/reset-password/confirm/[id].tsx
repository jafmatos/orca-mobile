import { AppFormField } from "@/components/AppFormField";
import { GlobalLayout } from "@/components/layouts/GlobalLayout";
import { ButtonWithLoading } from "@/components/ui/ButtonWithLoading";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { useAppToast } from "@/hooks/use-app-toast";
import { ConfirmResetPasswordArguments, ConfirmResetPasswordReturnType, ResetPasswordService } from "@/services/Auth/ResetPasswordService";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import { ButtonText, FormControlHelper, FormControlHelperText, Heading, Link, Text, View } from "@gluestack-ui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";

type ConfirmResetPasswordForm = {
  otp: string;
  password: string;
  passwordConfirmation: string;
};

export default function ConfirmResetPasswordScreen() {
  const toast = useAppToast();
  const params = useLocalSearchParams<{ id: string }>();
  const form = useAppForm<ConfirmResetPasswordForm>({ otp: "", password: "", passwordConfirmation: "" });
  const {
    hasErrors,
    hasError,
    getError,
    setValue,
    mutation: confirmResetPasswordMutation,
  } = useAppFormWithMutation<ConfirmResetPasswordForm, ConfirmResetPasswordArguments, ConfirmResetPasswordReturnType>(form, {
    mutationFn: () => ResetPasswordService.confirmResetPassword(params.id, form.values),
    onSuccess: (data) => {
      form.clear();

      AppAuthenticationTokenStore.set(data.token);

      toast.success({
        title: "Senha recuperada!",
        description: "Redirecionando para a página principal...",
      });

      setTimeout(() => {
        router.push("/(tabs)");
      }, 5000);
    },
  });
  const router = useRouter();

  return (
    <GlobalLayout>
      <View className="w-screen h-full p-6 flex flex-col justify-center">
        <View className="flex flex-col gap-2">
          <Heading size="3xl" className="!text-typography-100 !font-semibold">
            Nós te enviamos um código!
          </Heading>
          <Text marginBottom="$2" className="!text-typography-200">
            Para recuperar sua senha, digite o código que te enviamos pelo e-mail.
          </Text>
          <View className="flex" gap="$2">
            <AppFormField isRequired isInvalid={hasError("otp")}>
              <AppFormField.Label className="!text-typography-200 !font-medium">Código</AppFormField.Label>
              <AppFormField.TextInput
                value={form.values.otp}
                placeholder="Digite o código de verificação"
                textContentType="oneTimeCode"
                keyboardType="numeric"
                onChangeText={(text) => setValue("otp", text)}
                maxLength={6}
                required
              />
              <AppFormField.Error error={getError("otp")} />
            </AppFormField>
            <AppFormField isRequired isInvalid={hasError("password")}>
              <AppFormField.Label className="!text-typography-200 !font-medium">Nova senha</AppFormField.Label>
              <AppFormField.TextInput
                value={form.values.password}
                placeholder="Digite sua nova senha"
                textContentType="password"
                onChangeText={(text) => setValue("password", text)}
                secureTextEntry
                required
              />
              <AppFormField.Error error={getError("password")} />
            </AppFormField>
            <AppFormField isRequired isInvalid={hasError("passwordConfirmation")}>
              <AppFormField.Label className="!text-typography-200 !font-medium">Confirmação da nova senha</AppFormField.Label>
              <AppFormField.TextInput
                value={form.values.passwordConfirmation}
                placeholder="Digite a confirmação da nova senha"
                textContentType="password"
                onChangeText={(text) => setValue("passwordConfirmation", text)}
                secureTextEntry
                required
              />
              <AppFormField.Error error={getError("passwordConfirmation")} />
              <FormControlHelper>
                <FormControlHelperText>
                  <Link>
                    <Text size="sm" className="!text-typography-400">
                      Sua nova senha deve ter no mínimo 6 dígitos
                    </Text>
                  </Link>
                </FormControlHelperText>
              </FormControlHelper>
            </AppFormField>

            <ButtonWithLoading
              onPress={() => confirmResetPasswordMutation.mutateAsync(form.values)}
              isDisabled={form.values.otp?.length !== 6 || hasErrors || confirmResetPasswordMutation.isPending}
              isLoading={confirmResetPasswordMutation.isPending}
              action="primary"
              spinnerColor="$primary500"
            >
              <ButtonText color="$onPrimary">Confirmar</ButtonText>
            </ButtonWithLoading>
          </View>
        </View>
      </View>
    </GlobalLayout>
  );
}
