import { AppTextField } from "@/components/AppTextField";
import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { ThemedComponent } from "@/components/ThemedComponent";
import { Button } from "@/components/ui/gluestack/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { Text, View } from "react-native";
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignInForm>({
    resolver: yupResolver(formSchema),
  });

  const onSubmit: SubmitHandler<SignInForm> = (form) => {
    console.log(form);
  };

  return (
    <ThemedComponent>
      <KeyboardAvoidingComponent>
        <View className="p-4 flex flex-col justify-center">
          <View className="flex flex-col gap-4">
            <View>
              <Text className="text-3xl font-medium">Entrar</Text>
              <Text className="text-base font-normal">Acesse sua conta e acompanhe suas finanças de forma simples e segura.</Text>
            </View>
            <View className="flex gap-2">
              <AppTextField
                {...register("email", { required: true })}
                onChangeText={(text) => setValue("email", text)}
                // label="Email"
                placeholder="meuemail@gmail.com"
                keyboardType="email-address"
                errorMessage={errors.email?.message}
              />
              <AppTextField
                {...register("password", { required: true })}
                onChangeText={(text) => setValue("password", text)}
                // label="Senha"
                placeholder="******"
                secureTextEntry
                errorMessage={errors.password?.message}
              />

              <Button onPress={handleSubmit(onSubmit)} action="primary">
                <Text>Entrar</Text>
              </Button>
            </View>
          </View>
        </View>
      </KeyboardAvoidingComponent>
    </ThemedComponent>
  );
}
