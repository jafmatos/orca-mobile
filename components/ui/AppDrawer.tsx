import { useCallback, useEffect } from "react";
import { Dimensions, Pressable, View } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN, scheduleOnUI } from "react-native-worklets";
import { useTheme } from "react-native-paper";
import { useBackHandlerQueue } from "@/hooks/use-back-handler-queue";

export interface AppDrawerProps extends React.ComponentProps<typeof Animated.View> {
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: number;
  panSnapPoints?: number;
}

const screenDimensions = Dimensions.get("screen");
const SCREEN_HEIGHT = screenDimensions.height;
const SCREEN_WIDTH = screenDimensions.width;

export function AppDrawer({ panSnapPoints = 100, snapPoints = 0.8 * SCREEN_WIDTH, ...props }: AppDrawerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const drawerOpenedTranslateX = 0;
  const drawerTranslateX = useSharedValue(-snapPoints);
  const backdropOpacity = useSharedValue(0);
  const backdropColor = theme.colors.backdrop;

  const open = useCallback(() => {
    "worklet";

    drawerTranslateX.value = withSpring(0);
    backdropOpacity.value = withSpring(1);
  }, [backdropOpacity, drawerTranslateX]);

  const close = useCallback(() => {
    "worklet";

    drawerTranslateX.value = withSpring(-snapPoints);
    backdropOpacity.value = withSpring(0);

    scheduleOnRN(props.onClose);
  }, [props.onClose, backdropOpacity, drawerTranslateX, snapPoints]);

  const initializeAnimation = useCallback(() => {
    "worklet";

    if (props.isOpen) open();
    else close();
  }, [props.isOpen, open, close]);

  useEffect(() => {
    scheduleOnUI(initializeAnimation);
  }, [initializeAnimation]);

  useBackHandlerQueue({
    isOpen: props.isOpen,
    close: () => scheduleOnUI(close),
  });

  const pan = Gesture.Pan()
    .onStart((_event) => {
      "worklet";
    })
    .onChange((event) => {
      "worklet";

      if (event.translationX > 0) return;

      drawerTranslateX.value = withSpring(event.translationX);
    })
    .onFinalize((event) => {
      "worklet";

      if (event.translationX > -panSnapPoints) {
        drawerTranslateX.value = withSpring(drawerOpenedTranslateX);

        return;
      }

      close();
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
            pointerEvents: props.isOpen ? "auto" : "none",
            zIndex: 90,
            position: "absolute",
            inset: 0,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            backgroundColor: backdropColor,
            opacity: backdropOpacity,
          }}
        >
          <Pressable className="w-full h-full" onPress={props.onClose} />
        </Animated.View>

        <Animated.View
          {...props}
          className={`h-full ${props.className}`}
          style={{
            zIndex: 9999,
            width: snapPoints,
            backgroundColor: theme.colors.background,
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 16,
            transform: [{ translateX: drawerTranslateX }],
          }}
        />
      </View>
    </GestureDetector>
  );
}
