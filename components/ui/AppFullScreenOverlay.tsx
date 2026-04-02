import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect } from "react";
import { BackHandler, Dimensions, Pressable, Text, View } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface AppFullScreenOverlayProps extends React.ComponentProps<typeof Animated.View> {
  isOpen?: boolean;
  onClose?: () => void;
  backdropOpacity?: number;
  backdropColor?: string;
}

export interface AppFullScreenOverlayHeaderProps extends React.ComponentProps<typeof View> {
  onBack?: () => void;
  title: string;
}

export function AppFullScreenOverlayHeader(props: AppFullScreenOverlayHeaderProps) {
  const themeColors = useAppThemeColors();

  return (
    <View
      {...props}
      className="px-6 h-[72px] flex flex-row gap-3 items-center"
      style={{
        boxShadow: `0 1px 3px -2px ${themeColors["--color-outline-600"]}`,
      }}
    >
      <Pressable className="p-2" onPress={props.onBack}>
        <ArrowLeft size={28} color={themeColors["--color-typography-200"]} />
      </Pressable>
      <Text
        style={{
          fontWeight: 600,
          fontSize: 20,
          color: themeColors["--color-typography-200"],
        }}
      >
        {props.title}
      </Text>
    </View>
  );
}

export function AppFullScreenOverlay({ backdropOpacity = 0.5, backdropColor = "#000000", ...props }: AppFullScreenOverlayProps) {
  const themeColors = useAppThemeColors();
  const screenDimensions = Dimensions.get("screen");
  const SCREEN_WIDTH = screenDimensions.width;
  const SCREEN_HEIGHT = screenDimensions.height;
  const insets = useSafeAreaInsets();
  const translateXSharedValue = useSharedValue(props.isOpen ? 0 : SCREEN_WIDTH);
  const backdropOpacitySharedValue = useSharedValue(props.isOpen ? backdropOpacity : 0);

  useEffect(() => {
    const listener = BackHandler.addEventListener("hardwareBackPress", () => {
      if (props.isOpen) {
        props.onClose?.();

        return true;
      }
    });

    return () => {
      listener.remove();
    };
  }, [props]);

  useEffect(() => {
    if (props.isOpen) {
      translateXSharedValue.value = withSpring(0);
      backdropOpacitySharedValue.value = withSpring(backdropOpacity);
    } else {
      translateXSharedValue.value = withSpring(SCREEN_WIDTH);
      backdropOpacitySharedValue.value = withSpring(0);
    }
  }, [props.isOpen, backdropOpacity, translateXSharedValue, backdropOpacitySharedValue, SCREEN_WIDTH]);

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        top: 0,
        left: 0,
        pointerEvents: props.isOpen ? "auto" : "none",
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          top: 0,
          left: 0,
          backgroundColor: backdropColor,
          opacity: backdropOpacitySharedValue,
        }}
      />
      <Animated.View
        style={{
          position: "absolute",
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          top: 0,
          left: 0,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: themeColors["--color-background-950"],
          transform: [{ translateX: translateXSharedValue }],
        }}
      >
        {props.children}
      </Animated.View>
    </Animated.View>
  );
}

AppFullScreenOverlay.Header = AppFullScreenOverlayHeader;
