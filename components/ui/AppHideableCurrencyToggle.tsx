import { useAppTheme } from "@/hooks/use-app-theme";
import { useHideCurrencyStore } from "@/hooks/use-hide-currency";
import { Pressable } from "react-native";
import { Icon } from "react-native-paper";

export interface AppHideableCurrencyToggleProps {
  size?: number;
  color?: string;
  style?: React.ComponentProps<typeof Pressable>["style"];
}

export const AppHideableCurrencyToggle = (props: AppHideableCurrencyToggleProps) => {
  const theme = useAppTheme();
  const { isHidden, toggle } = useHideCurrencyStore();

  return (
    <Pressable onPress={toggle} style={props.style}>
      {isHidden ? (
        <Icon source="eye" size={props.size || 24} color={props.color || theme.colors.onBackground} />
      ) : (
        <Icon source="eye-off" size={props.size || 24} color={props.color || theme.colors.onBackground} />
      )}
    </Pressable>
  );
};
