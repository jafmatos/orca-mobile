import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native";

export interface SafeAreaComponentProps extends React.ComponentProps<typeof View> {
  ignoreTop?: boolean;
  ignoreBottom?: boolean;
}

export function SafeAreaComponent(props: SafeAreaComponentProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      {...props}
      style={[
        {
          paddingTop: !props.ignoreTop ? insets.top : 0,
          paddingBottom: !props.ignoreBottom ? insets.bottom : 0,
        },
        props.style,
      ]}
    />
  );
}
