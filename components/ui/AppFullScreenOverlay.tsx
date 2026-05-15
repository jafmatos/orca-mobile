import { useStackedBackHandler } from "@/hooks/use-stacked-back-handler";
import { Portal } from "@gorhom/portal";
import React, { useCallback, useImperativeHandle, useState } from "react";
import { Dimensions, Keyboard, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

export type AnimationCallback = () => void;

export type AnimationHooks = {
  onStarted: AnimationCallback;
  onFinished: AnimationCallback;
};

export interface AppFullScreenOverlayProps extends React.ComponentProps<typeof Animated.View> {
  onClose?: () => void;
  backdropOpacity?: number;
	title?: string;
  onOpenAnimationStarted?: AnimationCallback;
  onOpenAnimationFinished?: AnimationCallback;
  onCloseAnimationStarted?: AnimationCallback;
  onCloseAnimationFinished?: AnimationCallback;
}

export interface AppFullScreenOverlayRef {
  open: (hooks?: AnimationHooks) => void;
  close: (hooks?: AnimationHooks) => void;
}

export const AppFullScreenOverlay = React.forwardRef<AppFullScreenOverlayRef, AppFullScreenOverlayProps>(function AppFullScreenOverlay(
  { backdropOpacity = 1, ...props },
  ref
) {
  const screenDimensions = Dimensions.get("screen");
  const SCREEN_WIDTH = screenDimensions.width;
  const SCREEN_HEIGHT = screenDimensions.height;
  const overlayOpenedScale = 1;
  const overlayClosedScale = 0.8;
  const overlayOpenedOpacity = 1;
  const overlayClosedOpacity = 0;

  const [isOpen, setIsOpen] = useState(false);

  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isOpenSharedValue = useSharedValue(false);
  const scaleSharedValue = useSharedValue(overlayClosedScale);
  const opacitySharedValue = useSharedValue(overlayClosedOpacity);
  const backdropOpacitySharedValue = useSharedValue(0);
  const backdropColor = theme.colors.backdrop;

  const dismissKeyboard = () => Keyboard.dismiss();

  const open = useCallback(
    (hooks?: AnimationHooks) => {
      "worklet";

      if (hooks?.onStarted) scheduleOnRN(hooks.onStarted);
      if (props.onOpenAnimationStarted) scheduleOnRN(props.onOpenAnimationStarted);

      isOpenSharedValue.value = true;
      scaleSharedValue.value = withSpring(overlayOpenedScale);
      opacitySharedValue.value = withSpring(overlayOpenedOpacity);
      backdropOpacitySharedValue.value = withSpring(backdropOpacity, undefined, (finished) => {
        if (!finished) return;

        if (hooks?.onFinished) scheduleOnRN(hooks.onFinished);
        if (props.onOpenAnimationFinished) scheduleOnRN(props.onOpenAnimationFinished);
      });
    },
    [backdropOpacity, backdropOpacitySharedValue, isOpenSharedValue, opacitySharedValue, scaleSharedValue]
  );

  const close = useCallback(
    (hooks?: AnimationHooks) => {
      "worklet";

      scheduleOnRN(dismissKeyboard);

      if (hooks?.onStarted) scheduleOnRN(hooks.onStarted);
      if (props.onCloseAnimationStarted) scheduleOnRN(props.onCloseAnimationStarted);

      isOpenSharedValue.value = false;
      scaleSharedValue.value = withSpring(overlayClosedScale);
      opacitySharedValue.value = withSpring(overlayClosedOpacity);
      backdropOpacitySharedValue.value = withSpring(0, undefined, (isFinished) => {
        if (!isFinished) return;

        if (hooks?.onFinished) scheduleOnRN(hooks.onFinished);
        if (props.onCloseAnimationFinished) scheduleOnRN(props.onCloseAnimationFinished);
      });
    },
    [isOpenSharedValue, scaleSharedValue, opacitySharedValue, backdropOpacitySharedValue, props.onClose]
  );

  useImperativeHandle(ref, () => {
    return { open, close };
  });

  useAnimatedReaction(
    () => isOpenSharedValue.value,
    (isOpen) => scheduleOnRN(setIsOpen, isOpen),
    [isOpenSharedValue]
  );

  useStackedBackHandler({
    isOpen,
    onClose: close,
  });

  const containerAnimatedStyles = useAnimatedStyle(() => {
    "worklet";

    return {
      pointerEvents: isOpenSharedValue.value ? "auto" : "none",
    };
  }, [isOpenSharedValue]);

  return (
    <Portal hostName="fullscreen-overlay">
      <Animated.View
        style={[
          {
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 100,
          },
          containerAnimatedStyles,
        ]}
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
          <>
            <View
              className="px-4 h-[72px] flex flex-row gap-2 items-center"
              style={{
                backgroundColor: theme.colors.surface,
                boxShadow: `0 1px 3px -2px ${theme.colors.outlineVariant}`,
              }}
            >
              <IconButton icon="arrow-left" onPress={() => scheduleOnRN(close)} />
              <Text variant="titleLarge">{props.title}</Text>
            </View>

            {props.children}
          </>
        </Animated.View>
      </Animated.View>
    </Portal>
  );
});
