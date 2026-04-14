import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { NativeEvent, useKeyboardHandler } from "react-native-keyboard-controller";

export interface SafeAreaComponentProps extends React.ComponentProps<typeof Animated.View> {
  keyboardHandled?: boolean;
}

export function SafeAreaComponent(props: SafeAreaComponentProps) {
  const insets = useSafeAreaInsets();
  const viewPaddingSharedValue = useSharedValue(insets.bottom);

  const handleKeyboardHeightChange = (event: NativeEvent) => {
    "worklet";

    viewPaddingSharedValue.value = !props.keyboardHandled || event.height < insets.bottom ? insets.bottom : 0;
  };

  useKeyboardHandler({
    onStart: handleKeyboardHeightChange,
    onMove: handleKeyboardHeightChange,
    onEnd: handleKeyboardHeightChange,
  });

  return (
    <Animated.View
      {...props}
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: viewPaddingSharedValue,
        },
        props.style,
      ]}
    />
  );
}
