import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { Text, View } from "@gluestack-ui/themed";
import React, { useEffect, useState } from "react";
import { Dimensions, Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

export interface AppBottomSheetProps extends React.ComponentProps<typeof Animated.View> {
  children: React.ReactNode;
  isOpen: boolean;
  closeOnBackdropTap?: boolean;
  snapPointsCollapsed?: number;
  snapPointsExpanded?: number;
  panSnapPoints?: number;
  backdropOpacity?: number;
  backdropColor?: string;
  onClose: () => void;
}

const screenDimensions = Dimensions.get("screen");
const SCREEN_HEIGHT = screenDimensions.height;

export function AppBottomSheet({
  closeOnBackdropTap = true,
  snapPointsCollapsed = 400,
  snapPointsExpanded = SCREEN_HEIGHT * 0.9,
  panSnapPoints = 100,
  backdropOpacity = 0.5,
  backdropColor = "#000000",
  ...props
}: AppBottomSheetProps) {
  const themeColors = useAppThemeColors();
  const [isExpanded, setIsExpanded] = useState(false);

  const initialBottomSheetTranslateY = 0;
  const bottomSheetHeightSharedValue = useSharedValue(snapPointsCollapsed);
  const bottomSheetTranslateYSharedValue = useSharedValue(props.isOpen ? initialBottomSheetTranslateY : SCREEN_HEIGHT);

  const backdropOpacitySharedValue = useSharedValue(props.isOpen ? backdropOpacity : 0);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (props.isOpen) {
      backdropOpacitySharedValue.value = withSpring(backdropOpacity);
      bottomSheetTranslateYSharedValue.value = withSpring(initialBottomSheetTranslateY);
    } else {
      backdropOpacitySharedValue.value = withSpring(0);
      bottomSheetTranslateYSharedValue.value = withSpring(screenDimensions.height);
    }
  }, [props.isOpen, backdropOpacitySharedValue, bottomSheetTranslateYSharedValue, backdropOpacity]);

  const pan = Gesture.Pan()
    .onBegin((event) => {})
    .onChange((event) => {
      if (event.translationY > 0) {
        bottomSheetTranslateYSharedValue.value = withSpring(initialBottomSheetTranslateY + event.translationY);
      }

      if (event.translationY < 0 && isExpanded) {
        bottomSheetHeightSharedValue.value = withSpring(snapPointsExpanded + Math.abs(event.translationY));
      }

      if (event.translationY < 0 && !isExpanded) {
        bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed + Math.abs(event.translationY));
      }
    })
    .onFinalize((event) => {
      if (event.translationY < panSnapPoints && event.translationY > -panSnapPoints && !isExpanded) {
        bottomSheetTranslateYSharedValue.value = withSpring(initialBottomSheetTranslateY);
        bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed);
      }

      if (event.translationY < panSnapPoints && event.translationY > -panSnapPoints && isExpanded) {
        bottomSheetTranslateYSharedValue.value = withSpring(initialBottomSheetTranslateY);
        bottomSheetHeightSharedValue.value = withSpring(snapPointsExpanded);
      }

      if (event.translationY >= snapPointsCollapsed / 2 + panSnapPoints) {
        scheduleOnRN(props.onClose);
        scheduleOnRN(setIsExpanded, false);
      }

      if (event.translationY >= panSnapPoints && !isExpanded) scheduleOnRN(props.onClose);

      if (event.translationY >= panSnapPoints && isExpanded) {
        bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed);
        scheduleOnRN(setIsExpanded, false);
        bottomSheetTranslateYSharedValue.value = withSpring(initialBottomSheetTranslateY);
      }

      if (event.translationY <= -panSnapPoints && !isExpanded) {
        bottomSheetHeightSharedValue.value = withSpring(snapPointsExpanded);
        bottomSheetTranslateYSharedValue.value = withSpring(initialBottomSheetTranslateY);
        scheduleOnRN(setIsExpanded, true);
      }

      if (event.translationY <= -panSnapPoints && isExpanded) {
        bottomSheetTranslateYSharedValue.value = withSpring(initialBottomSheetTranslateY);
      }
    });

  return (
    <>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={{
            pointerEvents: props.isOpen ? "auto" : "none",
            width: screenDimensions.width,
            height: screenDimensions.height,
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "black",
            opacity: backdropOpacitySharedValue,
          }}
        >
          <Pressable
            className="w-full h-full"
            onPress={() => {
              bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed);
              setIsExpanded(false);
              closeOnBackdropTap && props.onClose?.();
            }}
          />
        </Animated.View>
      </GestureDetector>
      <Animated.View
        style={{
          height: bottomSheetHeightSharedValue,
          transform: [{ translateY: bottomSheetTranslateYSharedValue }],
          paddingBottom: insets.bottom,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          width: screenDimensions.width,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          boxShadow: `0 3px 7px 0 black`,
        }}
        className="bg-background-950 rounded-t-3xl"
      >
        <View
          className="flex flex-row justify-center"
          style={{
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          <View
            style={{
              borderRadius: 2,
              height: 4,
              width: 32,
              backgroundColor: themeColors["--color-typography-200"],
            }}
          />
        </View>
        <View className="p-4 pt-0">{props.children}</View>
      </Animated.View>
    </>
  );
}
