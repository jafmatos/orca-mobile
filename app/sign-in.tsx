import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { useForm, SubmitHandler } from "react-hook-form";
import { AppText } from "@/components/ui/AppText";
import { Button } from "react-native-paper";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AppTextField } from "@/components/AppTextField";
import { ThemedComponent } from "@/components/ThemedComponent";

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
        <View className="h-screen w-screen">
          <AppText as="h1" className="text-danger">
            Acesse sua conta
          </AppText>
          <View>
            <AppTextField
              {...register("email", { required: true })}
              onChangeText={(text) => setValue("email", text)}
              label="Email"
              placeholder="meuemail@gmail.com"
              keyboardType="email-address"
              errorMessage={errors.email?.message}
            />
            <AppTextField
              {...register("password", { required: true })}
              onChangeText={(text) => setValue("password", text)}
              label="Senha"
              placeholder="******"
              secureTextEntry
              errorMessage={errors.password?.message}
            />

            <Button onPress={handleSubmit(onSubmit)} mode="contained">
              Entrar
            </Button>
          </View>
        </View>
      </KeyboardAvoidingComponent>
    </ThemedComponent>
  );
}
