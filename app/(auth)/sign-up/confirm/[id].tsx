import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { AppFormField } from "@/components/ui/AppFormField";
import { AppOTPInput } from "@/components/ui/AppOTPInput";
import { AppKeyboardDismissing } from "@/components/utils/AppKeyboardDismissing";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { useAppRouter } from "@/hooks/use-app-router";
import { ConfirmSignUpArguments, ConfirmSignUpReturnType, SignUpService } from "@/services/Api/Users/Auth/SignUpApiService";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Button, HelperText, Text } from "react-native-paper";

type ConfirmSignUpForm = {
  otp: string;
};

export default function ConfirmSignUpScreen() {
  const router = useAppRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const form = useAppForm<ConfirmSignUpForm>({ otp: "" });
  const { mutation: confirmSignUpMutation } = useAppFormWithMutation<ConfirmSignUpForm, ConfirmSignUpArguments, ConfirmSignUpReturnType>(
    form,
    {
      mutationFn: () => SignUpService.confirmSignUp(params.id, form.values),
      onSuccess: (data) => {
        AppAuthenticationTokenStore.set(data.token);

        router.goToHome();
      },
    },
  );

  return (
    <FullScreenLayout>
      <AppKeyboardDismissing.ScrollView>
        <View className="p-6 flex flex-col justify-center min-h-full">
          <View className="flex flex-col gap-2">
            <Text variant="headlineMedium">Nós te enviamos um código!</Text>
            <Text variant="bodyMedium">Para confirmar o cadastro, digite o código que te enviamos pelo e-mail.</Text>

            <View className="flex gap-4">
              <AppFormField>
                <AppOTPInput
                  label="Código*"
                  placeholder="Digite o código de verificação"
                  mode="outlined"
                  value={form.values.otp}
                  onChangeText={form.makeSetter("otp")}
                  error={form.hasError("otp")}
                />
                {form.hasError("otp") && (
                  <HelperText type="error" visible={true}>
                    {form.getError("otp")}
                  </HelperText>
                )}
              </AppFormField>

              <Button
                className="mt-2"
                mode="contained"
                onPress={() => confirmSignUpMutation.mutateAsync(form.values)}
                disabled={form.values.otp?.length !== 6 || form.hasErrors || confirmSignUpMutation.isPending}
                loading={confirmSignUpMutation.isPending}
              >
                Confirmar
              </Button>
            </View>
          </View>
        </View>
      </AppKeyboardDismissing.ScrollView>
    </FullScreenLayout>
  );
}
