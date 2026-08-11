import { View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

enum KeyboardAnimationStatus {
  Opening = "opening",
  Opened = "open",
  Closing = "closing",
  Closed = "closed",
}

export interface AppSafeAreaComponentProps extends React.ComponentProps<typeof View> {
  ignoreTop?: boolean;
  ignoreBottom?: boolean;
  ignoreBottomOnKeyboardOpened?: boolean;
}

export function AppSafeAreaComponent(props: AppSafeAreaComponentProps) {
  const insets = useSafeAreaInsets();
  const keyboardAnimationStatus = useSharedValue<KeyboardAnimationStatus>(KeyboardAnimationStatus.Closed);

  useKeyboardHandler({
    onStart: (event) => {
      "worklet";

      keyboardAnimationStatus.value = !event.height ? KeyboardAnimationStatus.Closing : KeyboardAnimationStatus.Opening;
    },
    onEnd: () => {
      "worklet";

      if (keyboardAnimationStatus.value === KeyboardAnimationStatus.Opening) keyboardAnimationStatus.value = KeyboardAnimationStatus.Opened;
      if (keyboardAnimationStatus.value === KeyboardAnimationStatus.Closing) keyboardAnimationStatus.value = KeyboardAnimationStatus.Closed;
    },
  });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      paddingTop: !props.ignoreTop ? insets.top : 0,
      paddingBottom: !props.ignoreBottom
        ? props.ignoreBottomOnKeyboardOpened && (keyboardAnimationStatus.value === "opening" || keyboardAnimationStatus.value === "open")
          ? 0
          : insets.bottom
        : 0,
    };
  }, [keyboardAnimationStatus]);

  return <Animated.View {...props} style={[animatedStyles, props.style]} />;
}
