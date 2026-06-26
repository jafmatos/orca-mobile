import { useAppTheme } from "@/hooks/use-app-theme";
import { Text } from "react-native-paper";
import { SubscriptionCard } from "../SubscriptionCard";

export function SubscriptionPromoCard() {
  const theme = useAppTheme();

  return (
    <SubscriptionCard>
      <SubscriptionCard.Header title="Orça Full" />
			
      <SubscriptionCard.Content>
        <Text variant="bodyMedium" style={{ color: theme.colors.onPrimary }}>
          Desbloqueie o{" "}
          <Text variant="bodyMedium" style={{ fontWeight: "bold", color: theme.colors.onPrimary }}>
            Antônio
          </Text>{" "}
          (IA) para obter análises financeiras personalizadas e registro inteligente de transações!
        </Text>
      </SubscriptionCard.Content>

      <SubscriptionCard.Action onPress={() => {}}>Vamos lá!</SubscriptionCard.Action>
    </SubscriptionCard>
  );
}
