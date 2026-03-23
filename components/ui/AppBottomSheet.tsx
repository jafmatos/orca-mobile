import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { ScrollView, View } from "@gluestack-ui/themed";
import React, { useEffect } from "react";
import { Dimensions, Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { useKeyboardHandler } from "react-native-keyboard-controller";

export interface AppBottomSheetProps extends React.ComponentProps<typeof Animated.View> {
  children: React.ReactNode;
  isOpen: boolean;
  expandable?: boolean;
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
  closeOnBackdropTap = true,
  snapPointsCollapsed = 400,
  panSnapPoints = 100,
  backdropOpacity = 0.5,
  backdropColor = "#000000",
  ...props
}: AppBottomSheetProps) {
  const themeColors = useAppThemeColors();

  const bottomSheetOpenedTranslateY = 0;
  const isExpandedSharedValue = useSharedValue(false);
  const isKeyboardOpened = useSharedValue(false);
  const isKeyboardOpening = useSharedValue(false);
  const isKeyboardClosed = useSharedValue(false);
  const isKeyboardClosing = useSharedValue(false);

  const bottomSheetHeightSharedValue = useSharedValue(snapPointsCollapsed);
  const bottomSheetTranslateYSharedValue = useSharedValue(props.isOpen ? bottomSheetOpenedTranslateY : SCREEN_HEIGHT);

  const keyboardHeightSharedValue = useSharedValue(0);

  const backdropOpacitySharedValue = useSharedValue(props.isOpen ? backdropOpacity : 0);

  const insets = useSafeAreaInsets();

  const snapPointsScreen = SCREEN_HEIGHT - insets.top;

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

        if (!isKeyboardOpened.value) {
          isKeyboardOpening.value = true;
          isKeyboardClosing.value = false;
          isKeyboardClosed.value = false;
        } else {
          isKeyboardOpening.value = false;
          isKeyboardClosing.value = true;
          isKeyboardOpened.value = false;
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

        if (isKeyboardOpening.value) {
          isKeyboardOpened.value = true;
          isKeyboardOpening.value = false;
        }

        if (isKeyboardClosing.value) {
          isKeyboardClosed.value = true;
          isKeyboardClosing.value = false;
        }
      },
    },
    [],
  );

  const pan = Gesture.Pan()
    .onBegin((event) => {})
    .onChange((event) => {
      if (event.translationY > 0) {
        bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY + event.translationY);
      }

      if (event.translationY < 0 && !expandable) {
        bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed + Math.abs(event.translationY / 5));
      }

      if (event.translationY < 0 && expandable && isExpandedSharedValue.value) {
        bottomSheetHeightSharedValue.value = withSpring(snapPointsScreen + Math.abs(event.translationY));
      }

      if (event.translationY < 0 && expandable && !isExpandedSharedValue.value) {
        bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed + Math.abs(event.translationY));
      }
    })
    .onFinalize((event) => {
      if (event.translationY < panSnapPoints && event.translationY > -panSnapPoints) {
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

      if (event.translationY <= -panSnapPoints && !expandable) {
        bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed);
        bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY);
      }

      if (event.translationY <= -panSnapPoints && expandable && !isExpandedSharedValue.value) {
        bottomSheetHeightSharedValue.value = withSpring(snapPointsScreen - keyboardHeightSharedValue.value);
        bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY);
        isExpandedSharedValue.value = true;
      }

      if (event.translationY <= -panSnapPoints && expandable && isExpandedSharedValue.value) {
        bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY);
      }
    });

  const native = Gesture.Native().blocksExternalGesture(pan);

  const bottomSheetAnimatedStyles = useAnimatedStyle(() => {
    return {
      paddingBottom: isKeyboardOpened.value ? 0 : insets.bottom,
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

          <GestureDetector gesture={native}>
            <ScrollView
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
