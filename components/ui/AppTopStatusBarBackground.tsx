import { useAppTheme } from "@/hooks/use-app-theme";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface AppTopStatusBarBackgroundProps extends React.ComponentProps<typeof View> {
  color?: string;
  statusBarProps?: React.ComponentProps<typeof StatusBar>;
}

export function AppTopStatusBarBackground({ color, statusBarProps, ...props }: AppTopStatusBarBackgroundProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const backgroundColor = color ?? theme.colors.background;

  return (
    <>
      <StatusBar style={theme.dark ? "light" : "dark"} backgroundColor="transparent" translucent {...statusBarProps} />

      <View
        {...props}
        style={[
          {
            top: 0,
            height: insets.top,
            position: "absolute",
            width: "100%",
            zIndex: 1,
            backgroundColor,
          },
          props.style,
        ]}
      />
    </>
  );
}
