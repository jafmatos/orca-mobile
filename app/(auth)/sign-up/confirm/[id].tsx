import { AppFormField } from "@/components/AppFormField";
import { FullScreenLayout } from "@/components/layouts/FullScreenLayout";
import { ButtonWithLoading } from "@/components/ui/ButtonWithLoading";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { ConfirmSignUpArguments, ConfirmSignUpReturnType, SignUpService } from "@/services/Auth/SignUpService";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import { ButtonText, Heading, Text, View } from "@gluestack-ui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";

type ConfirmSignUpForm = {
  otp: string;
};

export default function ConfirmSignUpScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const form = useAppForm<ConfirmSignUpForm>({ otp: "" });
  const {
    hasErrors,
    hasError,
    getError,
    setValue,
    mutation: confirmSignUpMutation,
  } = useAppFormWithMutation<ConfirmSignUpForm, ConfirmSignUpArguments, ConfirmSignUpReturnType>(form, {
    mutationFn: () => SignUpService.confirmSignUp(params.id, form.values),
    onSuccess: (data) => {
      AppAuthenticationTokenStore.set(data.token);

      router.push("/(tabs)");
    },
  });
  const router = useRouter();

  return (
    <FullScreenLayout>
      <View className="w-screen h-full p-6 flex flex-col justify-center">
        <View className="flex flex-col gap-2">
          <Heading size="3xl" className="!text-typography-100 !font-semibold">
            Nós te enviamos um código!
          </Heading>
          <Text marginBottom="$2" className="!text-typography-200">
            Para confirmar o cadastro, digite o código que te enviamos pelo e-mail.
          </Text>
          <View className="flex" gap="$4">
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

            <ButtonWithLoading
              onPress={() => confirmSignUpMutation.mutateAsync(form.values)}
              isDisabled={form.values.otp?.length !== 6 || hasErrors || confirmSignUpMutation.isPending}
              isLoading={confirmSignUpMutation.isPending}
              action="primary"
              spinnerColor="$primary500"
            >
              <ButtonText color="$onPrimary">Confirmar</ButtonText>
            </ButtonWithLoading>
          </View>
        </View>
      </View>
    </FullScreenLayout>
  );
}
