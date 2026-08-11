import { KeyboardAvoidingView } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, { useSharedValue } from "react-native-reanimated";

export function AppKeyboardAvoidingComponent(props: React.ComponentProps<typeof KeyboardAvoidingView>) {
  const keyboardHeightSharedValue = useSharedValue(0);

  useKeyboardHandler({
    onMove: (event) => {
      "worklet";

      keyboardHeightSharedValue.value = event.height;
    },
  });

  return <Animated.View {...props} style={[{ flex: 1, paddingBottom: keyboardHeightSharedValue }, props.style]} />;
}
