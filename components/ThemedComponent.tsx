import { useAppGluestackColorTokens } from "@/hooks/use-app-gluestack-color-tokens";
import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { useAppThemeName } from "@/hooks/use-app-theme-name";
import useAppThemeVars from "@/hooks/use-app-theme-vars";
import { darkThemeVars } from "@/themes/tailwind-dark-theme-vars";
import { lightThemeVars } from "@/themes/tailwind-light-theme-vars";
import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { Dimensions, View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export function ThemedComponent(props: ViewProps) {
  const themeVars = useAppThemeVars();
  const themeColors = useAppThemeColors();
  const themeName = useAppThemeName();
  const gluestackColorTokens = useAppGluestackColorTokens();
  const screenDimension = Dimensions.get("screen");
  const insets = useSafeAreaInsets();

  return (
    <View {...props} style={themeVars} className="grow">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{
            position: "absolute",
            height: screenDimension.height + insets.top,
            width: screenDimension.width,
            top: -insets.top,
            backgroundColor: themeColors["--color-background-950"],
          }}
        />
        <GluestackUIProvider
          colorMode={themeName}
          config={{
            ...config,
            light: lightThemeVars,
            dark: darkThemeVars,
            tokens: {
              ...config.tokens,
              colors: {
                ...config.tokens.colors,
                ...gluestackColorTokens,
              },
            },
          }}
        >
          {props.children}
        </GluestackUIProvider>
      </GestureHandlerRootView>
    </View>
  );
}
