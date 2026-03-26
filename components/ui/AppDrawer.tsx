import { useEffect } from "react";
import { Dimensions, Pressable, View } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { ThemedComponent } from "../ThemedComponent";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";

export interface AppDrawerProps extends React.ComponentProps<typeof Animated.View> {
  isOpen?: boolean;
  onClose: () => void;
  snapPoints?: number;
  panSnapPoints?: number;
}

const screenDimensions = Dimensions.get("screen");
const SCREEN_HEIGHT = screenDimensions.height;
const SCREEN_WIDTH = screenDimensions.width;

export function AppDrawer({ isOpen, onClose, panSnapPoints = 100, snapPoints = 0.8 * SCREEN_WIDTH, ...props }: AppDrawerProps) {
  const insets = useSafeAreaInsets();
  const drawerOpenedTranslateX = 0;
  const drawerTranslateX = useSharedValue(-snapPoints);
  const backdropOpacity = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart((_event) => {})
    .onChange((event) => {
      if (event.translationX > 0) return;

      drawerTranslateX.value = withSpring(event.translationX);
    })
    .onFinalize((event) => {
      if (event.translationX > -panSnapPoints) {
        drawerTranslateX.value = withSpring(drawerOpenedTranslateX);

        return;
      }

      scheduleOnRN(onClose);
    });

  useEffect(() => {
    if (isOpen) {
      drawerTranslateX.value = withSpring(0);
      backdropOpacity.value = withSpring(0.5);
    } else {
      drawerTranslateX.value = withSpring(-snapPoints);
      backdropOpacity.value = withSpring(0);
    }
  }, [isOpen, snapPoints, drawerTranslateX, backdropOpacity]);

  return (
    <GestureDetector gesture={pan}>
      <View
        style={{
          pointerEvents: isOpen ? "auto" : "none",
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <Animated.View
          style={{
            pointerEvents: isOpen ? "auto" : "none",
            zIndex: 90,
            position: "absolute",
            inset: 0,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            backgroundColor: "black",
            opacity: backdropOpacity,
          }}
        >
          <Pressable className="w-full h-full" onPress={onClose} />
        </Animated.View>
        <ThemedComponent
          style={{
            pointerEvents: isOpen ? "auto" : "none",
            zIndex: 9999,
            position: "absolute",
            width: snapPoints,
            height: SCREEN_HEIGHT,
            left: 0,
          }}
        >
          <Animated.View
            {...props}
            className={`bg-background-950 h-full ${props.className}`}
            style={{
              paddingTop: insets.top + 16,
              paddingBottom: insets.bottom + 16,
              transform: [{ translateX: drawerTranslateX }],
            }}
          />
        </ThemedComponent>
      </View>
    </GestureDetector>
  );
}
