import useAppTheme from "@/hooks/use-app-theme";
import { View, ViewProps } from "react-native";

export function ThemedComponent(props: ViewProps) {
  const [theme] = useAppTheme();

  return (
    <View {...props} style={theme} className="w-screen h-screen bg-background">
      {props.children}
    </View>
  );
}
