import { useBackHandlerQueue } from "@/hooks/use-back-handler-queue";
import { Portal } from "@gorhom/portal";
import React, { PropsWithChildren, useCallback, useImperativeHandle, useState } from "react";
import { Dimensions, Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN, scheduleOnUI } from "react-native-worklets";
import { Conditional } from "../utils/Conditional";
import { AppKeyboardDismissing } from "./AppKeyboardDismissing";

export type AnimationCallback = () => void;

export type AnimationHooks = {
  onStarted?: AnimationCallback;
  onFinished?: AnimationCallback;
};

export interface AppFullScreenOverlayProps extends Omit<React.ComponentProps<typeof Animated.View>, "children"> {
  portalHostName?: string;
  title?: string;
  HeaderComponent?: React.ReactNode;
  HeaderRightComponent?: React.ReactNode;
  backdropOpacity?: number;
  animationDuration?: number;
  onOpenAnimationStarted?: AnimationCallback;
  onOpenAnimationFinished?: AnimationCallback;
  onCloseAnimationStarted?: AnimationCallback;
  onCloseAnimationFinished?: AnimationCallback;
  children?: PropsWithChildren["children"];
}

export interface AppFullScreenOverlayRef {
  open: (hooks?: AnimationHooks) => void;
  close: (hooks?: AnimationHooks) => void;
}

export const AppFullScreenOverlay = React.forwardRef<AppFullScreenOverlayRef, AppFullScreenOverlayProps>(function AppFullScreenOverlay(
  { backdropOpacity = 1, animationDuration = 300, ...props },
  ref,
) {
  const screenDimensions = Dimensions.get("screen");
  const SCREEN_WIDTH = screenDimensions.width;
  const SCREEN_HEIGHT = screenDimensions.height;
  const overlayOpenedTranslateX = 0;
  const overlayClosedTranslateX = SCREEN_WIDTH;

  const [isOpen, setIsOpen] = useState(false);

  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isOpenSharedValue = useSharedValue(false);
  const translateXSharedValue = useSharedValue(overlayClosedTranslateX);
  const backdropOpacitySharedValue = useSharedValue(0);
  const backdropColor = theme.colors.backdrop;
  const isVisibleSharedValue = useSharedValue(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const open = useCallback(
    (hooks?: AnimationHooks) => {
      "worklet";

      isVisibleSharedValue.value = true;

      if (hooks?.onStarted) scheduleOnRN(hooks.onStarted);
      if (props.onOpenAnimationStarted) scheduleOnRN(props.onOpenAnimationStarted);

      isOpenSharedValue.value = true;
      translateXSharedValue.value = withSpring(overlayOpenedTranslateX, { duration: animationDuration });
      backdropOpacitySharedValue.value = withSpring(backdropOpacity, { duration: animationDuration }, (finished) => {
        if (!finished) return;

        if (hooks?.onFinished) scheduleOnRN(hooks.onFinished);
        if (props.onOpenAnimationFinished) scheduleOnRN(props.onOpenAnimationFinished);
      });
    },
    [
      animationDuration,
      backdropOpacity,
      backdropOpacitySharedValue,
      isOpenSharedValue,
      isVisibleSharedValue,
      props.onOpenAnimationFinished,
      props.onOpenAnimationStarted,
      translateXSharedValue,
    ],
  );

  const close = useCallback(
    (hooks?: AnimationHooks) => {
      "worklet";

      scheduleOnRN(dismissKeyboard);

      if (hooks?.onStarted) scheduleOnRN(hooks.onStarted);
      if (props.onCloseAnimationStarted) scheduleOnRN(props.onCloseAnimationStarted);

      isOpenSharedValue.value = false;
      translateXSharedValue.value = withSpring(overlayClosedTranslateX, { duration: animationDuration });
      backdropOpacitySharedValue.value = withSpring(0, { duration: animationDuration }, (isFinished) => {
        if (!isFinished) return;

        if (hooks?.onFinished) scheduleOnRN(hooks?.onFinished);
        if (props.onCloseAnimationFinished) scheduleOnRN(props.onCloseAnimationFinished);

        isVisibleSharedValue.value = false;
      });
    },
    [
      props.onCloseAnimationStarted,
      props.onCloseAnimationFinished,
      isOpenSharedValue,
      isVisibleSharedValue,
      translateXSharedValue,
      overlayClosedTranslateX,
      animationDuration,
      backdropOpacitySharedValue,
    ],
  );

  useAnimatedReaction(
    () => isOpenSharedValue.value,
    (isOpen) => scheduleOnRN(setIsOpen, isOpen),
    [isOpenSharedValue],
  );

  useBackHandlerQueue({
    isOpen: isOpen,
    close: () => scheduleOnUI(close),
  });

  useImperativeHandle(ref, () => {
    return {
      open: (...args: Parameters<typeof open>) => scheduleOnUI(() => open(...args)),
      close: (...args: Parameters<typeof close>) => scheduleOnUI(() => close(...args)),
    };
  }, [open, close]);

  const containerAnimatedStyles = useAnimatedStyle(() => {
    "worklet";

    return {
      pointerEvents: isOpenSharedValue.value ? "auto" : "none",
      display: isVisibleSharedValue.value ? "flex" : "none",
    };
  }, [isOpenSharedValue, isVisibleSharedValue]);

  const backdropAnimatedStyles = useAnimatedStyle(() => {
    "worklet";

    return {
      opacity: backdropOpacitySharedValue.value,
    };
  }, [backdropOpacitySharedValue]);

  const contentAnimatedStyles = useAnimatedStyle(() => {
    "worklet";

    return {
      transform: [{ translateX: translateXSharedValue.value }],
    };
  }, [translateXSharedValue]);

  return (
    <Portal hostName={props.portalHostName || "fullscreen-overlay"}>
      <Animated.View
        style={[
          {
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            position: "absolute",
            zIndex: 100,
            display: "none",
          },
          containerAnimatedStyles,
        ]}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
              backgroundColor: backdropColor,
              opacity: 0,
            },
            backdropAnimatedStyles,
          ]}
        />

        <Animated.View
          style={[
            {
              position: "absolute",
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              backgroundColor: theme.colors.background,
              transform: [{ translateX: SCREEN_WIDTH }],
            },
            contentAnimatedStyles,
          ]}
        >
          <View
            className="px-4 h-[72px] flex flex-row gap-2 items-center"
            style={{
              pointerEvents: "auto",
              backgroundColor: theme.colors.surface,
              boxShadow: `0 1px 3px -2px ${theme.colors.outlineVariant}`,
            }}
          >
            <AppKeyboardDismissing.View>
              <Conditional
                if={!!props.HeaderComponent}
                _then={props.HeaderComponent}
                _else={
                  <View className="flex-row gap-2 items-center flex-1 justify-between">
                    <View className="flex-row gap-2 items-center flex-1 pr-4">
                      <IconButton
                        size={24}
                        style={{ marginLeft: 0, width: 44, height: 44 }}
                        iconColor={theme.colors.onBackground}
                        icon="arrow-left"
                        onPress={() => scheduleOnRN(close)}
                      />

                      <Text variant="titleLarge" numberOfLines={1} style={{ flexShrink: 1 }}>
                        {props.title ?? ""}
                      </Text>
                    </View>
                    {props.HeaderRightComponent && <View>{props.HeaderRightComponent}</View>}
                  </View>
                }
              />
            </AppKeyboardDismissing.View>
          </View>

          <View style={{ flex: 1 }}>{props.children}</View>
        </Animated.View>
      </Animated.View>
    </Portal>
  );
});
