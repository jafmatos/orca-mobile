import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { useAppThemeName } from "@/hooks/use-app-theme-name";
import useAppThemeVars from "@/hooks/use-app-theme-vars";
import { darkThemeVars } from "@/themes/tailwind-dark-theme-vars";
import { lightThemeVars } from "@/themes/tailwind-light-theme-vars";
import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { Dimensions, View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ThemedComponent(props: ViewProps) {
  const themeVars = useAppThemeVars();
  const themeColors = useAppThemeColors();
  const themeName = useAppThemeName();
  const screenDimension = Dimensions.get("screen");
  const insets = useSafeAreaInsets();

  return (
    <View {...props} style={themeVars}>
      <View
        style={{
          position: "absolute",
          height: screenDimension.height + insets.top,
          width: screenDimension.width,
          top: -insets.top,
          backgroundColor: themeColors["--color-background-950"],
        }}
      />
      {/* <View
        className="border-2 border-solid border-green-500"
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      > */}
        <GluestackUIProvider
          colorMode={themeName}
          config={{
            ...config,
            light: lightThemeVars,
            dark: darkThemeVars,
          }}
        >
          {props.children}
        </GluestackUIProvider>
      {/* </View> */}
    </View>
  );
}
