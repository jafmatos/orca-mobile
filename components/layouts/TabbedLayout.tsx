import { AppToast } from "../AppToast";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export function TabbedLayout(props: React.ComponentProps<typeof View>) {
  const theme = useTheme();

  return (
    <View className={`grow ${props.className}`} style={{ backgroundColor: theme.colors.background }}>
      {props.children}

      <AppToast topOffset={8} />
    </View>
  );
}
