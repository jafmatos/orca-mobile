import { Portal } from "@gorhom/portal";
import React, { useImperativeHandle, useRef, useState, useEffect } from "react";
import { useTheme } from "react-native-paper";
import { BottomSheet, BottomSheetControlledProps, BottomSheetImperativeProps, BottomSheetRef } from "jam-bottomsheet";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useBackHandlerQueue } from "@/hooks/use-back-handler-queue";

export interface AppBottomSheetComplementaryProps {
  portalHostName?: string;
}

export type AppBottomSheetRef = BottomSheetRef;

export type AppBottomSheetProps = (BottomSheetControlledProps | BottomSheetImperativeProps) & AppBottomSheetComplementaryProps;

export const AppBottomSheet = React.forwardRef<AppBottomSheetRef, AppBottomSheetProps>(function AppBottomSheet(
  { portalHostName, children, ...bottomSheetProps }: AppBottomSheetProps,
  ref,
) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(!!bottomSheetProps.isOpen);
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const isVisibleSharedValue = useSharedValue(!!bottomSheetProps.isOpen);

  useImperativeHandle(ref, () => {
    return {
      open: (hooks) => {
        "worklet";

				isVisibleSharedValue.value = true;
        bottomSheetRef.current?.open(hooks);
      },
      close: (hooks) => {
        "worklet";
        bottomSheetRef.current?.close(hooks);
      },
    };
  });

  const wrapperAnimatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      display: isVisibleSharedValue.value ? "flex" : "none",
    };
  }, [isVisibleSharedValue]);

  useEffect(() => {
    if (!bottomSheetProps.imperative) {
      isVisibleSharedValue.value = !!bottomSheetProps.isOpen;
    }
  }, [bottomSheetProps.imperative, bottomSheetProps.isOpen, isVisibleSharedValue]);

  useBackHandlerQueue({
    isOpen,
    close: () => bottomSheetRef.current?.close(),
  });

  return (
    <Portal hostName={portalHostName || "bottomsheet"}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "none",
            zIndex: 100,
          },
          wrapperAnimatedStyle,
        ]}
      >
        <BottomSheet
          {...bottomSheetProps}
          ref={bottomSheetRef}
          backgroundColor={theme.colors.background}
          handleColor={theme.colors.onBackground}
          backdropColor={theme.colors.backdrop}
          backdropOpacity={1}
          style={bottomSheetProps.style}
          onOpenAnimationStarted={() => {
            setIsOpen(true);
            bottomSheetProps.onOpenAnimationStarted?.();
          }}
          onCloseAnimationStarted={() => {
            setIsOpen(false);
            bottomSheetProps.onCloseAnimationStarted?.();
          }}
          onCloseAnimationFinished={() => {
            isVisibleSharedValue.value = false;
            bottomSheetProps.onCloseAnimationFinished?.();
          }}
        >
          <View className="p-4">{children}</View>
        </BottomSheet>
      </Animated.View>
    </Portal>
  );
});
