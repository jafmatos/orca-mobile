import { GlobalLayout } from "@/components/layouts/GlobalLayout";
import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import { Button, ButtonText, Text } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthUser();

  return (
    <GlobalLayout>
      <Text>{`Olá, ${user?.name}!`}</Text>
      <Button
        backgroundColor="$danger500"
        onPress={() => {
          AppAuthenticationTokenStore.remove();
          router.push("/(auth)/sign-in");
        }}
      >
        <ButtonText color="$onDanger">Sair</ButtonText>
      </Button>
    </GlobalLayout>
  );
}
