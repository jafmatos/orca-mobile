import { AppFormField } from "@/components/AppFormField";
import { GlobalLayout } from "@/components/layouts/GlobalLayout";
import { ButtonWithLoading } from "@/components/ui/ButtonWithLoading";
import { websiteUrl } from "@/constants/website-url";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { CreateResetPasswordKeyArguments, CreateResetPasswordKeyReturnType, ResetPasswordService } from "@/services/ResetPasswordService";
import { ButtonText, Heading, Link, Text, View } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";

type ResetPasswordForm = {
  email: string;
};

export default function ResetPasswordScreen() {
  const router = useRouter();
  const form = useAppForm<ResetPasswordForm>({
    email: "",
  });

  const {
    hasErrors,
    getError,
    hasError,
    setValue,
    mutation: createResetPasswordKeyMutation,
  } = useAppFormWithMutation<ResetPasswordForm, CreateResetPasswordKeyArguments, CreateResetPasswordKeyReturnType>(form, {
    mutationFn: ResetPasswordService.createResetPasswordKey,
    onSuccess: (data) => {
      router.push({
        pathname: "/(auth)/reset-password/confirm/[id]",
        params: {
          id: data.key.id,
        },
      });
    },
  });

  return (
    <GlobalLayout>
      <View className="w-screen h-full p-6 flex flex-col justify-center">
        <View className="flex flex-col gap-2">
          <Heading size="3xl" className="!text-typography-100 !font-semibold">
            Recuperar senha
          </Heading>
          <Text marginBottom="$2" className="!text-typography-200">
            Esqueceu a senha? Acontece. Digite seu e-mail abaixo e te ajudaremos a recuperar o acesso.
          </Text>
          <View className="flex" gap="$4">
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

            <ButtonWithLoading
              onPress={() =>
                createResetPasswordKeyMutation.mutateAsync({
                  ...form.values,
                  confirmUrl: websiteUrl,
                })
              }
              isDisabled={createResetPasswordKeyMutation.isPending || hasErrors}
              isLoading={createResetPasswordKeyMutation.isPending}
              spinnerColor="$primary500"
              action="primary"
            >
              <ButtonText color="$onPrimary">Enviar</ButtonText>
            </ButtonWithLoading>
          </View>

          <Link mt="$2" className="self-center" onPress={() => router.push("/(auth)/sign-in")}>
            <Text className="flex items-center !text-typography-400" size="sm">
              Voltar para o login
            </Text>
          </Link>
        </View>
      </View>
    </GlobalLayout>
  );
}
