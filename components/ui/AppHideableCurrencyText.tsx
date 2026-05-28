import { useHideCurrencyStore } from "@/hooks/use-hide-currency";
import { Text } from "react-native-paper";

export function AppHideableCurrencyText(props: React.ComponentProps<typeof Text>) {
  const isHidden = useHideCurrencyStore((state) => state.isHidden);

  if (isHidden) return <Text {...props}>••••••</Text>;

  return <Text {...props} />;
}
