import { useAppRouter } from "@/hooks/use-app-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import { router } from "expo-router";
import { Button } from "react-native-paper";

export function AppLogoutButton() {
  const router = useAppRouter();
  const theme = useAppTheme();

  return (
    <Button
      mode="contained"
      icon="logout"
      buttonColor={theme.colors.error}
      textColor={theme.colors.onError}
      onPress={() => {
        AppAuthenticationTokenStore.remove();

        router.goToSignIn();
      }}
    >
      Sair
    </Button>
  );
}
