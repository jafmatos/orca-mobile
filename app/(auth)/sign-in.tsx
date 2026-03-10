import { AppFormField } from "@/components/AppFormField";
import { GlobalLayout } from "@/components/layouts/GlobalLayout";
import { AuthenticationService } from "@/services/AuthenticationService";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import { Button, ButtonText, FormControlHelper, FormControlHelperText, Link, Text } from "@gluestack-ui/themed";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { View } from "react-native";
import * as yup from "yup";

type SignInForm = {
  email: string;
  password: string;
};

const formSchema = yup.object({
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  password: yup.string().required("A senha é obrigatória"),
});

export default function SignInScreen() {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<SignInForm>({
    resolver: yupResolver(formSchema),
  });

  function handleInputChange<T = any>(propertyName: keyof SignInForm) {
    return (value: T) => {
      setValue(propertyName, value as unknown as any);
      clearErrors(propertyName);
    };
  }

  const onSubmit: SubmitHandler<SignInForm> = async (form) => {
    try {
      const data = await AuthenticationService.createAuthenticationToken({
        email: form.email,
        password: form.password,
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
      <View className="w-screen h-full p-6 flex flex-col justify-center items-start">
        <View className="flex flex-col gap-2">
          <Text size="3xl" className="!text-typography-100 !font-semibold">
            Entrar
          </Text>
          <Text marginBottom="$2" className="!text-typography-200">
            Acesse sua conta e acompanhe suas finanças de forma simples e segura.
          </Text>
          <View className="flex gap-2">
            <AppFormField isRequired isInvalid={!!errors.email?.message}>
              <AppFormField.Label className="!text-typography-200 !font-medium">Email</AppFormField.Label>
              <AppFormField.TextInput
                placeholder="Insira seu e-mail"
                textContentType="emailAddress"
                onChangeText={handleInputChange("email")}
                required
              />
              <AppFormField.Error error={errors.email?.message} />
            </AppFormField>
            <AppFormField isRequired isInvalid={!!errors.password?.message}>
              <AppFormField.Label className="!text-typography-200 !font-medium">Senha</AppFormField.Label>
              <AppFormField.TextInput
                placeholder="Insira sua senha"
                textContentType="password"
                onChangeText={handleInputChange("password")}
                secureTextEntry
                required
              />
              <AppFormField.Error error={errors.password?.message} />
              <FormControlHelper>
                <FormControlHelperText>
                  <Link>
                    <Text size="sm" className="!text-typography-400">
                      Esqueceu a senha?
                    </Text>
                  </Link>
                </FormControlHelperText>
              </FormControlHelper>
            </AppFormField>

            <Button className="mt-4" onPress={handleSubmit(onSubmit)} action="primary">
              <ButtonText>Entrar</ButtonText>
            </Button>
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
    </GlobalLayout>
  );
}
