import { PropsWithChildren } from "react";
import { AppToast } from "../AppToast";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export function TabbedLayout(props: PropsWithChildren) {
  const theme = useTheme();

  return (
    <View className="grow" style={{ backgroundColor: theme.colors.background }}>
      {props.children}

      <AppToast topOffset={8} />
    </View>
  );
}
