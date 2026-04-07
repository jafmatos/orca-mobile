import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { useStackedBackHandler } from "@/hooks/use-stacked-back-handler";
import { Portal } from "@gorhom/portal";
import { ArrowLeft } from "lucide-react-native";
import React, { useCallback, useEffect } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN, scheduleOnUI } from "react-native-worklets";

export interface AppFullScreenOverlayProps extends React.ComponentProps<typeof Animated.View> {
  isOpen: boolean;
  onClose: () => void;
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
  const translateXSharedValue = useSharedValue(SCREEN_WIDTH);
  const backdropOpacitySharedValue = useSharedValue(0);

  const open = useCallback(() => {
    "worklet";

    translateXSharedValue.value = withSpring(0);
    backdropOpacitySharedValue.value = withSpring(backdropOpacity);
  }, [backdropOpacity, backdropOpacitySharedValue, translateXSharedValue]);

  const close = useCallback(() => {
    "worklet";

    translateXSharedValue.value = withSpring(SCREEN_WIDTH);
    backdropOpacitySharedValue.value = withSpring(0);

    scheduleOnRN(props.onClose);
  }, [props.onClose, SCREEN_WIDTH, backdropOpacitySharedValue, translateXSharedValue]);

  const initializeAnimation = useCallback(() => {
    "worklet";

    if (props.isOpen) open();
    else close();
  }, [props.isOpen, open, close]);

  useEffect(() => {
    scheduleOnUI(initializeAnimation);
  }, [initializeAnimation]);

  useStackedBackHandler({
    isOpen: props.isOpen,
    onClose: close,
  });

  return (
    <Portal hostName="fullscreen-overlay">
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
    </Portal>
  );
}

AppFullScreenOverlay.Header = AppFullScreenOverlayHeader;
