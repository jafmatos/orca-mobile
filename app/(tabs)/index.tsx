import { GlobalLayout } from "@/components/layouts/GlobalLayout";
import { useAppToast } from "@/hooks/use-app-toast";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native";

export default function HomeScreen() {
  const toast = useAppToast();
  const router = useRouter();

  return (
    <GlobalLayout>
      <Text>HomeScreen</Text>
      <Button onPress={() => router.push("/sign-in")} title="Ir para SignInScreen" />
      <Button
        onPress={() => {
          toast.success({
            title: "Olá",
            description: "Seja bem vindo!",
          });
        }}
        title="Mostrar notificação de sucesso"
      />
      <Button
        onPress={() => {
          toast.warning({
            title: "Olá",
            description: "Seja bem vindo!",
          });
        }}
        title="Mostrar notificação de aviso"
      />
      <Button
        onPress={() => {
          toast.error({
            title: "Olá",
            description: "Seja bem vindo!",
          });
        }}
        title="Mostrar notificação de erro"
      />
    </GlobalLayout>
  );
}
