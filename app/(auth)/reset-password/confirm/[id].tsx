import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { AppOTPInput } from "@/components/ui/AppOTPInput";
import { AppSecureInput } from "@/components/ui/AppSecureInput";
import { FormField } from "@/components/ui/FormField";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { useAppRouter } from "@/hooks/use-app-router";
import { useAppToast } from "@/hooks/use-app-toast";
import {
  ConfirmResetPasswordArguments,
  ConfirmResetPasswordReturnType,
  ResetPasswordService,
} from "@/services/Api/Users/Auth/ResetPasswordApiService";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Button, HelperText, Text } from "react-native-paper";

type ConfirmResetPasswordForm = {
  otp: string;
  password: string;
  passwordConfirmation: string;
};

export default function ConfirmResetPasswordScreen() {
  const router = useAppRouter();
  const toast = useAppToast();
  const params = useLocalSearchParams<{ id: string }>();
  const form = useAppForm<ConfirmResetPasswordForm>({ otp: "", password: "", passwordConfirmation: "" });
  const { mutation: confirmResetPasswordMutation } = useAppFormWithMutation<
    ConfirmResetPasswordForm,
    ConfirmResetPasswordArguments,
    ConfirmResetPasswordReturnType
  >(form, {
    mutationFn: () => ResetPasswordService.confirmResetPassword(params.id, form.values),
    onSuccess: (data) => {
      form.clear();

      AppAuthenticationTokenStore.set(data.token);

      toast.success({
        title: "Senha recuperada!",
        description: "Redirecionando para a página principal...",
      });

      setTimeout(() => {
        router.goToHome();
      }, 5000);
    },
  });

  return (
    <FullScreenLayout>
      <View className="w-screen h-full p-6 flex flex-col justify-center">
        <View className="flex flex-col gap-2">
          <Text variant="headlineMedium">Nós te enviamos um código!</Text>
          <Text variant="bodyMedium">Para recuperar sua senha, digite o código que te enviamos pelo e-mail.</Text>
          <View className="flex gap-2">
            <FormField>
              <AppOTPInput
                label="Código*"
                placeholder="Digite o código de verificação"
                mode="outlined"
                value={form.values.otp}
                onChangeText={form.makeSetter("otp")}
                error={form.hasError("otp")}
              />
              <HelperText type="error" visible={form.hasError("otp")}>
                {form.getError("otp")}
              </HelperText>
            </FormField>

            <FormField>
              <AppSecureInput
                label="Nova senha*"
                placeholder="Digite sua nova senha"
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
                label="Confirmação da nova senha*"
                placeholder="Confirme sua nova senha"
                value={form.values.passwordConfirmation}
                onChangeText={form.makeSetter("passwordConfirmation")}
                error={form.hasError("passwordConfirmation") || form.values.password !== form.values.passwordConfirmation}
                mode="outlined"
              />
              <HelperText
                type="error"
                visible={form.hasError("passwordConfirmation") || form.values.password !== form.values.passwordConfirmation}
              >
                {form.getError("passwordConfirmation") || "As senhas não coincidem"}
              </HelperText>
            </FormField>

            <Button
              mode="contained"
              onPress={() => confirmResetPasswordMutation.mutateAsync(form.values)}
              disabled={form.values.otp?.length !== 6 || form.hasErrors || confirmResetPasswordMutation.isPending}
              loading={confirmResetPasswordMutation.isPending}
            >
              Confirmar
            </Button>
          </View>
        </View>
      </View>
    </FullScreenLayout>
  );
}
