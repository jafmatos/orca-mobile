import { useAppTheme } from "@/hooks/use-app-theme";
import { useStackedBackHandler } from "@/hooks/use-stacked-back-handler";
import { Portal } from "@gorhom/portal";
import React, { useCallback, useEffect } from "react";
import { Dimensions, Pressable } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { scheduleOnRN, scheduleOnUI } from "react-native-worklets";

export interface AppModalProps extends React.ComponentProps<typeof Animated.View> {
  isOpen: boolean;
  backdropOpacity?: number;
  onClose: () => void;
}

export function AppModal({ backdropOpacity = 0.5, ...props }: AppModalProps) {
  const theme = useAppTheme();
  const screenDimensions = Dimensions.get("screen");
  const SCREEN_WIDTH = screenDimensions.width;
  const SCREEN_HEIGHT = screenDimensions.height;
  const backdropOpacitySharedValue = useSharedValue(0);
  const modalOpacitySharedValue = useSharedValue(0);
  const backdropColor = theme.colors.backdrop;

  const open = useCallback(() => {
    "worklet";

    backdropOpacitySharedValue.value = withSpring(backdropOpacity);
    modalOpacitySharedValue.value = withSpring(1);
  }, [backdropOpacity, backdropOpacitySharedValue, modalOpacitySharedValue]);

  const close = useCallback(() => {
    "worklet";

    backdropOpacitySharedValue.value = withSpring(0);
    modalOpacitySharedValue.value = withSpring(0);

    scheduleOnRN(props.onClose);
  }, [backdropOpacitySharedValue, modalOpacitySharedValue, props.onClose]);

  const initializeAnimation = useCallback(() => {
    "worklet";

    if (props.isOpen) open();
    else close();
  }, [close, open, props.isOpen]);

  useEffect(() => {
    scheduleOnUI(initializeAnimation);
  }, [initializeAnimation]);

  useStackedBackHandler({
    isOpen: props.isOpen,
    onClose: close,
  });

  return (
    <Portal hostName="modal">
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          pointerEvents: props.isOpen ? "auto" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
        }}
      >
        <Animated.View
          className="w-full h-full"
          style={{
            position: "absolute",
            backgroundColor: backdropColor,
            opacity: backdropOpacitySharedValue,
          }}
        >
          <Pressable className="w-full h-full" onPress={props.onClose} />
        </Animated.View>
        <Animated.View
          style={[
            {
              pointerEvents: "auto",
              opacity: modalOpacitySharedValue,
              width: SCREEN_WIDTH * 0.85,
              maxWidth: 384,
              borderRadius: theme.roundness,
              boxShadow: `0 3px 7px 0 rgba(0, 0, 0, 0.5)`,
              backgroundColor: theme.colors.background,
            },
            props.style,
          ]}
          className={props.className}
        >
          {props.children}
        </Animated.View>
      </Animated.View>
    </Portal>
  );
}
