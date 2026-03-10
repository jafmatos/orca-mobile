import { AppFormField } from "@/components/AppFormField";
import { GlobalLayout } from "@/components/layouts/GlobalLayout";
import { ApiError } from "@/models/ApiError";
import { SignUpService } from "@/services/SignUpService";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import { Button, ButtonText, Text } from "@gluestack-ui/themed";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { View } from "react-native";
import * as yup from "yup";

type ConfirmSignUpForm = {
  otp: string;
};

const formSchema = yup.object({
  otp: yup
    .string()
    .matches(/[0-9]{6}/, "O código deve ter exatamente 6 dígitos")
    .required("O código é obrigatório"),
});

export default function ConfirmSignUpScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
  } = useForm<ConfirmSignUpForm>({
    resolver: yupResolver(formSchema),
  });

  const formValues = watch();

  function handleInputChange<T = any>(propertyName: keyof ConfirmSignUpForm) {
    return (value: T) => {
      setValue(propertyName, value as unknown as any);
      clearErrors(propertyName);
    };
  }

  const onSubmit: SubmitHandler<ConfirmSignUpForm> = async (form) => {
    try {
      const data = await SignUpService.confirmSignUp(params.id, {
        otp: form.otp,
      });

      AppAuthenticationTokenStore.set(data.token);

      router.push("/(tabs)");
    } catch (error: unknown) {
      // TODO: treat error
      console.log(error);
    }
  };

  return (
    <GlobalLayout>
      <View className="w-screen h-full p-6 flex flex-col justify-center">
        <View className="flex flex-col gap-2">
          <Text size="3xl" className="!text-typography-100 !font-semibold">
            Nós te enviamos um código!
          </Text>
          <Text marginBottom="$2" className="!text-typography-200">
            Para confirmar o cadastro, insira o código que te enviamos pelo e-mail.
          </Text>
          <View className="flex gap-2">
            <AppFormField isInvalid={!!errors.otp?.message}>
              <AppFormField.Label className="!text-typography-200 !font-medium">Código</AppFormField.Label>
              <AppFormField.TextInput
                placeholder="Insira o código de verificação"
                textContentType="oneTimeCode"
                keyboardType="numeric"
                onChangeText={handleInputChange("otp")}
                maxLength={6}
                required
              />
              <AppFormField.Error error={errors.otp?.message} />
            </AppFormField>

            <Button className="mt-4" onPress={handleSubmit(onSubmit)} action="primary" isDisabled={formValues.otp?.length !== 6}>
              <ButtonText color="$onPrimary">Continuar</ButtonText>
            </Button>
          </View>
        </View>
      </View>
    </GlobalLayout>
  );
}
