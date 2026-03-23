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
      backdropOpacitySharedValue.value = withSpring(backdropOpacity);
      bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY);
    } else {
      backdropOpacitySharedValue.value = withSpring(0);
      bottomSheetTranslateYSharedValue.value = withSpring(screenDimensions.height);
    }
  }, [props.isOpen, backdropOpacitySharedValue, bottomSheetHeightSharedValue, bottomSheetTranslateYSharedValue, backdropOpacity]);

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
      // Makes the bottomsheet go down by changing the translateY
      if (event.translationY > 0) {
        bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY + event.translationY);
      }

      // Makes the bottomsheet go slightly up by changing the height if its not expandable
      if (event.translationY < 0 && !expandable) {
        bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed + Math.abs(event.translationY / 5));
      }

      // Makes the bottomsheet spring back to original position if already expanded
      if (event.translationY < 0 && expandable && isExpandedSharedValue.value) {
        bottomSheetHeightSharedValue.value = withSpring(snapPointsScreen + Math.abs(event.translationY));
      }

      // Makes the bottomsheet go up by changing the height
      if (event.translationY < 0 && expandable && !isExpandedSharedValue.value) {
        bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed + Math.abs(event.translationY));
      }
    })
    .onFinalize((event) => {
      // Makes the bottomsheet go back to the original position and height if the pan isnt long enough to collapse or expand
      if (event.translationY < panSnapPoints && event.translationY > -panSnapPoints) {
        bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY);
        bottomSheetHeightSharedValue.value = withSpring(isExpandedSharedValue.value ? snapPointsScreen : snapPointsCollapsed);
      }

      // Makes the bottomsheet close if the pan down is longer than the usual even if its expanded
      if (event.translationY >= snapPointsCollapsed / 2 + panSnapPoints) {
        scheduleOnRN(props.onClose);

        isExpandedSharedValue.value = false;
      }

      // Makes the bottomsheet close if the pan down is long enough
      if (event.translationY >= panSnapPoints && !isExpandedSharedValue.value) scheduleOnRN(props.onClose);

      // Makes the bottomsheet collapse if the pan is long enough and its expanded
      if (event.translationY >= panSnapPoints && isExpandedSharedValue.value) {
        bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed);
        bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY);
        isExpandedSharedValue.value = false;
      }

      // Makes the bottomsheet go back to the original height and translateY if the pan up is enough and it cant be expanded
      if (event.translationY <= -panSnapPoints && !expandable) {
        bottomSheetHeightSharedValue.value = withSpring(snapPointsCollapsed);
        bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY);
      }

      // Makes the bottomsheet expand if the pan up is enough and it can be expanded
      if (event.translationY <= -panSnapPoints && expandable && !isExpandedSharedValue.value) {
        bottomSheetHeightSharedValue.value = withSpring(snapPointsScreen);
        bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY);
        isExpandedSharedValue.value = true;
      }

      // Makes the bottomsheet go back to its original translateY if the pan up is enough and its already expanded
      if (event.translationY <= -panSnapPoints && expandable && isExpandedSharedValue.value) {
        bottomSheetTranslateYSharedValue.value = withSpring(bottomSheetOpenedTranslateY);
      }
    });

  const native = Gesture.Native().blocksExternalGesture(pan);

  const bottomSheetAnimatedStyles = useAnimatedStyle(() => {
    const expectedHeight = isKeyboardOpened
      ? isExpandedSharedValue.value
        ? snapPointsScreen
        : snapPointsCollapsed
      : bottomSheetHeightSharedValue.value;

    const height = Math.min(expectedHeight, snapPointsScreen - keyboardHeightSharedValue.value);

		return {
      height: height,
      transform: [{ translateY: bottomSheetTranslateYSharedValue.value - keyboardHeightSharedValue.value }],
      paddingBottom: isKeyboardOpened.value ? 0 : insets.bottom,
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
