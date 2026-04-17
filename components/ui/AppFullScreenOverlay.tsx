import { useStackedBackHandler } from "@/hooks/use-stacked-back-handler";
import { Portal } from "@gorhom/portal";
import { ArrowLeft } from "lucide-react-native";
import React, { useCallback, useEffect } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN, scheduleOnUI } from "react-native-worklets";

export interface AppFullScreenOverlayProps extends React.ComponentProps<typeof Animated.View> {
  isOpen: boolean;
  onClose: () => void;
  backdropOpacity?: number;
}

export interface AppFullScreenOverlayHeaderProps extends React.ComponentProps<typeof View> {
  onBack?: () => void;
  title: string;
}

export function AppFullScreenOverlayHeader(props: AppFullScreenOverlayHeaderProps) {
  const theme = useTheme();

  return (
    <View
      {...props}
      className="px-6 h-[72px] flex flex-row gap-3 items-center"
      style={{
        backgroundColor: theme.colors.surface,
        boxShadow: `0 1px 3px -2px ${theme.colors.outlineVariant}`,
      }}
    >
      <Pressable className="p-2" onPress={props.onBack}>
        <ArrowLeft size={28} color={theme.colors.onBackground} />
      </Pressable>
      <Text
        style={{
          fontWeight: 600,
          fontSize: 20,
          color: theme.colors.onBackground,
        }}
      >
        {props.title}
      </Text>
    </View>
  );
}

export function AppFullScreenOverlay({ backdropOpacity = 0.5, ...props }: AppFullScreenOverlayProps) {
  const screenDimensions = Dimensions.get("screen");
  const SCREEN_WIDTH = screenDimensions.width;
  const SCREEN_HEIGHT = screenDimensions.height;
  const overlayOpenedScale = 1;
  const overlayClosedScale = 0.8;
  const overlayOpenedOpacity = 1;
  const overlayClosedOpacity = 0;

  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const scaleSharedValue = useSharedValue(overlayClosedScale);
  const opacitySharedValue = useSharedValue(overlayClosedOpacity);
  const backdropOpacitySharedValue = useSharedValue(0);
  const backdropColor = theme.colors.backdrop;

  const open = useCallback(() => {
    "worklet";

    scaleSharedValue.value = withSpring(overlayOpenedScale);
    opacitySharedValue.value = withSpring(overlayOpenedOpacity);
    backdropOpacitySharedValue.value = withSpring(backdropOpacity);
  }, [backdropOpacity, backdropOpacitySharedValue, opacitySharedValue, scaleSharedValue]);

  const close = useCallback(() => {
    "worklet";

    scaleSharedValue.value = withSpring(overlayClosedScale);
    opacitySharedValue.value = withSpring(overlayClosedOpacity);
    backdropOpacitySharedValue.value = withSpring(0);

    scheduleOnRN(props.onClose);
  }, [scaleSharedValue, opacitySharedValue, backdropOpacitySharedValue, props.onClose]);

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
          zIndex: 100,
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
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            backgroundColor: theme.colors.background,
            transform: [{ scale: scaleSharedValue }],
            opacity: opacitySharedValue,
          }}
        >
          {props.children}
        </Animated.View>
      </Animated.View>
    </Portal>
  );
}

AppFullScreenOverlay.Header = AppFullScreenOverlayHeader;
