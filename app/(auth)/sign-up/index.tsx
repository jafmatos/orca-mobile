import { AppFormField } from "@/components/AppFormField";
import { GlobalLayout } from "@/components/layouts/GlobalLayout";
import { websiteUrl } from "@/constants/website-url";
import { ApiError } from "@/models/ApiError";
import { SignUpService } from "@/services/SignUpService";
import {
  Button,
  ButtonText,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  CheckIcon,
  FormControlHelper,
  FormControlHelperText,
  Link,
  Text,
} from "@gluestack-ui/themed";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { View } from "react-native";
import * as yup from "yup";

type SignUpForm = {
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
  acceptedTerms: boolean;
};

const formSchema = yup.object({
  email: yup.string().email("Email inválido").required("O email é obrigatório"),
  name: yup.string().required("O nome é obrigatório"),
  password: yup.string().min(6).required("A senha é obrigatória"),
  passwordConfirmation: yup
    .string()
    .required("A confirmação de senha é obrigatória")
    .oneOf([yup.ref("password")], "As senhas estão diferentes"),
  acceptedTerms: yup.boolean().required(),
});

export default function SignUpScreen() {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
  } = useForm<SignUpForm>({
    resolver: yupResolver(formSchema),
  });

  const formValues = watch();

  function handleInputChange<T = any>(propertyName: keyof SignUpForm) {
    return (value: T) => {
      setValue(propertyName, value as unknown as any);
      clearErrors(propertyName);
    };
  }

  const onSubmit: SubmitHandler<SignUpForm> = async (form) => {
    try {
      const data = await SignUpService.createSignUpKey({
        name: form.name,
        email: form.email,
        password: form.password,
        passwordConfirmation: form.passwordConfirmation,
        acceptedTerms: form.acceptedTerms,
        confirmUrl: websiteUrl,
      });

      router.push({
        pathname: "/(auth)/sign-up/confirm/[id]",
        params: {
          id: data.key.id,
        },
      });
    } catch (error: any) {
      // TODO: treat error
      console.log(error);
    }
  };

  return (
    <GlobalLayout>
      <View className="w-screen h-full p-6 flex flex-col justify-center">
        <View className="flex flex-col gap-2">
          <Text size="3xl" className="!text-typography-100 !font-semibold">
            Cadastrar-se
          </Text>
          <Text marginBottom="$2" className="!text-typography-200">
            Junte-se a nós e comece a gerenciar suas finanças de forma simples e segura.
          </Text>
          <View className="flex gap-2">
            <AppFormField isRequired isInvalid={!!errors.name?.message}>
              <AppFormField.Label className="!text-typography-200 !font-medium">Nome</AppFormField.Label>
              <AppFormField.TextInput
                placeholder="Informe seu nome"
                textContentType="name"
                onChangeText={handleInputChange("name")}
                required
              />
              <AppFormField.Error error={errors.email?.message} />
            </AppFormField>
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
            </AppFormField>
            <AppFormField isRequired isInvalid={!!errors.passwordConfirmation?.message}>
              <AppFormField.Label className="!text-typography-200 !font-medium">Confirmação da Senha</AppFormField.Label>
              <AppFormField.TextInput
                placeholder="Confirme sua senha"
                textContentType="password"
                onChangeText={handleInputChange("passwordConfirmation")}
                secureTextEntry
                required
              />
              <AppFormField.Error error={errors.passwordConfirmation?.message} />
              <FormControlHelper>
                <FormControlHelperText>
                  <Link>
                    <Text size="sm" className="!text-typography-400">
                      Sua senha deve ter no mínimo 6 dígitos
                    </Text>
                  </Link>
                </FormControlHelperText>
              </FormControlHelper>
            </AppFormField>
            <AppFormField isRequired className="mt-2">
              <Checkbox value="Terms of Use" size="md" onChange={(value) => setValue("acceptedTerms", value)}>
                <View className="flex flex-row gap-2">
                  <CheckboxIndicator>
                    <CheckboxIcon as={() => <CheckIcon color="$onPrimary" />} />
                  </CheckboxIndicator>
                  <CheckboxLabel>Eu li e aceito os termos de uso</CheckboxLabel>
                </View>
              </Checkbox>
            </AppFormField>

            <Button className="mt-4" onPress={handleSubmit(onSubmit)} action="primary" isDisabled={!formValues.acceptedTerms}>
              <ButtonText color="$onPrimary">Continuar</ButtonText>
            </Button>
          </View>
          <View className="mt-2 flex flex-row gap-0 self-center">
            <Text className="flex items-center !text-typography-400" size="sm">
              Já tem uma conta?{" "}
            </Text>
            <Link onPress={() => router.push("/(auth)/sign-in")}>
              <Text color="$info500" size="sm">
                Entrar
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </GlobalLayout>
  );
}
