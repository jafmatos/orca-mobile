import { AppFormField } from "@/components/AppFormField";
import { GlobalLayout } from "@/components/layouts/GlobalLayout";
import { ButtonWithLoading } from "@/components/ui/ButtonWithLoading";
import { websiteUrl } from "@/constants/website-url";
import { useAppForm } from "@/hooks/use-app-form";
import { useAppFormWithMutation } from "@/hooks/use-app-form-with-mutation";
import { CreateSignUpKeyArguments, CreateSignUpKeyReturnType, SignUpService } from "@/services/SignUpService";
import {
  ButtonText,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  CheckIcon,
  FormControlHelper,
  FormControlHelperText,
  Heading,
  Link,
  Text,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { View } from "react-native";

type SignUpForm = {
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
  acceptedTerms: boolean;
};

export default function SignUpScreen() {
  const router = useRouter();
  const form = useAppForm<SignUpForm>({
    email: "",
    name: "",
    password: "",
    passwordConfirmation: "",
    acceptedTerms: false,
  });

  const {
    hasErrors,
    getError,
    hasError,
    setValue,
    mutation: createSignUpKeyMutation,
  } = useAppFormWithMutation<SignUpForm, CreateSignUpKeyArguments, CreateSignUpKeyReturnType>(form, {
    mutationFn: SignUpService.createSignUpKey,
    onSuccess: (data) => {
      router.push({
        pathname: "/(auth)/sign-up/confirm/[id]",
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
            Cadastrar-se
          </Heading>
          <Text marginBottom="$2" className="!text-typography-200">
            Junte-se a nós e comece a gerenciar suas finanças de forma simples e segura.
          </Text>
          <View className="flex gap-2">
            <AppFormField isRequired isInvalid={hasError("name")}>
              <AppFormField.Label className="!text-typography-200 !font-medium">Nome</AppFormField.Label>
              <AppFormField.TextInput
                value={form.values.name}
                placeholder="Informe seu nome"
                textContentType="name"
                onChangeText={(text) => setValue("name", text)}
                required
              />
              <AppFormField.Error error={getError("name")} />
            </AppFormField>
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
            </AppFormField>
            <AppFormField isRequired isInvalid={hasError("passwordConfirmation")}>
              <AppFormField.Label className="!text-typography-200 !font-medium">Confirmação da Senha</AppFormField.Label>
              <AppFormField.TextInput
                value={form.values.passwordConfirmation}
                placeholder="Confirme sua senha"
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
                      Sua senha deve ter no mínimo 6 dígitos
                    </Text>
                  </Link>
                </FormControlHelperText>
              </FormControlHelper>
            </AppFormField>
            <AppFormField isRequired className="mt-2">
              <Checkbox
                isChecked={form.values.acceptedTerms}
                value="Terms of Use"
                size="md"
                onChange={(value) => setValue("acceptedTerms", value)}
              >
                <View className="flex flex-row gap-2">
                  <CheckboxIndicator>
                    <CheckboxIcon as={() => <CheckIcon color="$onPrimary" />} />
                  </CheckboxIndicator>
                  <CheckboxLabel>Eu li e aceito os termos de uso</CheckboxLabel>
                </View>
              </Checkbox>
            </AppFormField>

            <ButtonWithLoading
              onPress={() =>
                createSignUpKeyMutation.mutateAsync({
                  ...form.values,
                  confirmUrl: websiteUrl,
                })
              }
              isDisabled={!form.values.acceptedTerms || hasErrors || createSignUpKeyMutation.isPending}
              isLoading={createSignUpKeyMutation.isPending}
              spinnerColor="$primary500"
              action="primary"
            >
              <ButtonText color="$onPrimary">Enviar</ButtonText>
            </ButtonWithLoading>
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
