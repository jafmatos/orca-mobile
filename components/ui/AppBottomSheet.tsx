import useAppThemeColors from "@/hooks/use-app-theme-colors";
import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { useKeyboardHandler } from "react-native-keyboard-controller";

export interface AppBottomSheetProps extends React.ComponentProps<typeof Animated.View> {
  children: React.ReactNode;
  isOpen: boolean;
  expandable?: boolean;
  fullscreen?: boolean;
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
const SCREEN_WIDTH = screenDimensions.width;

export function AppBottomSheet({
  expandable = false,
  fullscreen = false,
  closeOnBackdropTap = true,
  snapPointsCollapsed = 400,
  panSnapPoints = 100,
  backdropOpacity = 0.5,
  backdropColor = "#000000",
  ...props
}: AppBottomSheetProps) {
  const themeColors = useAppThemeColors();
  const insets = useSafeAreaInsets();
  const [isScrollViewOnStart, _setIsScrollViewOnStart] = useState(true);
  const [isScrollViewOnEnd, _setIsScrollViewOnEnd] = useState(true);
  const snapPointsScreen = SCREEN_HEIGHT - insets.top;

  const setIsScrollViewOnStart = (value: boolean) => {
    if (value === isScrollViewOnStart) return;

    _setIsScrollViewOnStart(value);
  };

  const setIsScrollViewOnEnd = (value: boolean) => {
    if (value === isScrollViewOnEnd) return;

    _setIsScrollViewOnEnd(value);
  };

  if (fullscreen) snapPointsCollapsed = snapPointsScreen;

  const bottomSheetOpenedTranslateY = 0;
  const isExpandedSharedValue = useSharedValue(false);
  const isKeyboardOpenedSharedValue = useSharedValue(false);
  const isKeyboardOpeningSharedValue = useSharedValue(false);
  const isKeyboardClosedSharedValue = useSharedValue(false);
  const isKeyboardClosingSharedValue = useSharedValue(false);
  const scrollViewContentSizeSharedValue = useSharedValue(0);
  const scrollViewLayoutSizeSharedValue = useSharedValue(0);
  const scrollViewContentOffsetSharedValue = useSharedValue(0);
  const bottomSheetHeightSharedValue = useSharedValue(fullscreen ? snapPointsScreen : snapPointsCollapsed);
  const bottomSheetTranslateYSharedValue = useSharedValue(props.isOpen ? bottomSheetOpenedTranslateY : SCREEN_HEIGHT);

  const keyboardHeightSharedValue = useSharedValue(0);

  const backdropOpacitySharedValue = useSharedValue(props.isOpen ? backdropOpacity : 0);

  useEffect(() => {
    if (props.isOpen) {
      bottomSheetHeightSharedValue.value = snapPointsCollapsed;
      backdropOpacitySharedValue.value = withSpring(backdropOpacity);
      bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY);
    } else {
      backdropOpacitySharedValue.value = withSpring(0);
      bottomSheetTranslateYSharedValue.value = withSpring(screenDimensions.height);
    }
  }, [
    props.isOpen,
    backdropOpacitySharedValue,
    bottomSheetHeightSharedValue,
    bottomSheetTranslateYSharedValue,
    backdropOpacity,
    snapPointsCollapsed,
  ]);

  useKeyboardHandler(
    {
      onStart: () => {
        "worklet";

        if (!isKeyboardOpenedSharedValue.value) {
          isKeyboardOpeningSharedValue.value = true;
          isKeyboardClosingSharedValue.value = false;
          isKeyboardClosedSharedValue.value = false;
        } else {
          isKeyboardOpeningSharedValue.value = false;
          isKeyboardClosingSharedValue.value = true;
          isKeyboardOpenedSharedValue.value = false;
        }
      },
      onMove: (event) => {
        "worklet";

        const expectedBottomSheetHeight = isExpandedSharedValue.value ? snapPointsScreen : snapPointsCollapsed;

        bottomSheetHeightSharedValue.value = Math.min(expectedBottomSheetHeight, snapPointsScreen - event.height);

        keyboardHeightSharedValue.value = event.height;
      },
      onEnd: () => {
        "worklet";

        if (isKeyboardOpeningSharedValue.value) {
          isKeyboardOpenedSharedValue.value = true;
          isKeyboardOpeningSharedValue.value = false;
        }

        if (isKeyboardClosingSharedValue.value) {
          isKeyboardClosedSharedValue.value = true;
          isKeyboardClosingSharedValue.value = false;
        }
      },
    },
    [],
  );

  const panDownGestureOnBeginCallback: NonNullable<Parameters<ReturnType<typeof Gesture.Pan>["onBegin"]>[0]> = (event) => {};

  const panDownGestureOnChangeCallback: NonNullable<Parameters<ReturnType<typeof Gesture.Pan>["onChange"]>[0]> = (event) => {
    if (event.translationY < 0) return;

    bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY + event.translationY);
  };

  const panDownGestureOnFinalizeCallback: NonNullable<Parameters<ReturnType<typeof Gesture.Pan>["onFinalize"]>[0]> = (event) => {
    if (event.translationY < 0) return;

    if (event.translationY < panSnapPoints) {
      bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY);
      bottomSheetHeightSharedValue.value = withSpring(isExpandedSharedValue.value ? snapPointsScreen : snapPointsCollapsed);
    }

    if (event.translationY >= snapPointsCollapsed / 2 + panSnapPoints) {
      scheduleOnRN(props.onClose);

      isExpandedSharedValue.value = false;
    }

    if (event.translationY >= panSnapPoints && !isExpandedSharedValue.value) scheduleOnRN(props.onClose);

    if (event.translationY >= panSnapPoints && isExpandedSharedValue.value) {
      bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed);
      bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY);
      isExpandedSharedValue.value = false;
    }
  };

  const panUpGestureOnBeginCallback: NonNullable<Parameters<ReturnType<typeof Gesture.Pan>["onBegin"]>[0]> = (event) => {};

  const panUpGestureOnChangeCallback: NonNullable<Parameters<ReturnType<typeof Gesture.Pan>["onChange"]>[0]> = (event) => {
    if (event.translationY > 0 || fullscreen) return;

    if (!expandable) {
      bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed + Math.abs(event.translationY / 5));
    }

    if (expandable && !isExpandedSharedValue.value) {
      bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed + Math.abs(event.translationY));
    }
  };

  const panUpGestureOnFinalizeCallback: NonNullable<Parameters<ReturnType<typeof Gesture.Pan>["onFinalize"]>[0]> = (event) => {
    if (event.translationY > 0 || isExpandedSharedValue.value || fullscreen) return;

    if (event.translationY > -panSnapPoints) {
      bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY);
      bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed);
    }

    if (event.translationY <= -panSnapPoints && !expandable) {
      bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed);
      bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY);
    }

    if (event.translationY <= -panSnapPoints && expandable) {
      bottomSheetHeightSharedValue.value = withSpring(snapPointsScreen - keyboardHeightSharedValue.value);
      bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY);
      isExpandedSharedValue.value = true;
    }
  };

  const panDown = Gesture.Pan()
    .onBegin(panDownGestureOnBeginCallback)
    .onChange(panDownGestureOnChangeCallback)
    .onFinalize(panDownGestureOnFinalizeCallback);

  const panUp = Gesture.Pan()
    .onBegin(panUpGestureOnBeginCallback)
    .onChange(panUpGestureOnChangeCallback)
    .onFinalize(panUpGestureOnFinalizeCallback);

  const nativePanDown = Gesture.Pan()
    .onBegin(panDownGestureOnBeginCallback)
    .onChange(panDownGestureOnChangeCallback)
    .onFinalize(panDownGestureOnFinalizeCallback)
    .enabled(isScrollViewOnStart);

  const nativePanUp = Gesture.Pan()
    .onBegin(panUpGestureOnBeginCallback)
    .onChange(panUpGestureOnChangeCallback)
    .onFinalize(panUpGestureOnFinalizeCallback)
    .enabled(isScrollViewOnEnd);

  const pan = Gesture.Simultaneous(panDown, panUp);
  const native = Gesture.Native().blocksExternalGesture(panDown, panUp);
  const panNative = Gesture.Simultaneous(native, nativePanDown, nativePanUp);

  const bottomSheetAnimatedStyles = useAnimatedStyle(() => {
    return {
      paddingBottom: isKeyboardOpenedSharedValue.value ? 0 : insets.bottom,
      transform: [{ translateY: bottomSheetTranslateYSharedValue.value - keyboardHeightSharedValue.value }],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <View
        style={{
          pointerEvents: props.isOpen ? "auto" : "none",
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <Animated.View
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: backdropColor,
            opacity: backdropOpacitySharedValue,
          }}
        >
          <Pressable
            className="w-full h-full"
            onPress={() => {
              bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed);
              isExpandedSharedValue.value = false;
              closeOnBackdropTap && props.onClose?.();
            }}
          />
        </Animated.View>

        <Animated.View
          style={[
            {
              height: bottomSheetHeightSharedValue,
              width: SCREEN_WIDTH,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              boxShadow: `0 3px 7px 0 black`,
            },
            bottomSheetAnimatedStyles,
          ]}
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

          <GestureDetector gesture={panNative}>
            <ScrollView
              onLayout={(event) => {
                scrollViewLayoutSizeSharedValue.value = event.nativeEvent.layout.height;
              }}
              onContentSizeChange={(_width, height) => {
                if (height < scrollViewLayoutSizeSharedValue.value) {
                  setIsScrollViewOnStart(true);
                  setIsScrollViewOnEnd(true);
                }
              }}
              onScroll={(event) => {
                const layoutSize = event.nativeEvent.layoutMeasurement.height;
                const contentOffset = event.nativeEvent.contentOffset.y;
                const contentSize = event.nativeEvent.contentSize.height;

                scrollViewContentOffsetSharedValue.value = contentOffset;
                scrollViewLayoutSizeSharedValue.value = layoutSize;
                scrollViewContentSizeSharedValue.value = contentSize;

                setIsScrollViewOnStart(contentOffset <= 0);
                setIsScrollViewOnEnd(Math.round(layoutSize + contentOffset) === Math.round(contentSize));
              }}
              scrollEventThrottle={16}
              contentContainerStyle={{
                padding: 16,
                paddingTop: 0,
              }}
            >
              {props.children}
            </ScrollView>
          </GestureDetector>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
