import { useEffect } from "react";
import { Dimensions, Pressable } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { ThemedComponent } from "../ThemedComponent";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface AppDrawerProps extends React.ComponentProps<typeof Animated.View> {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AppDrawer({ isOpen, onClose, ...props }: AppDrawerProps) {
  const drawerWidth = 224;
  const windowDimensions = Dimensions.get("window");
  const screenDimensions = Dimensions.get("screen");
  const insets = useSafeAreaInsets();
  const drawerTranslateX = useSharedValue(drawerWidth);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      drawerTranslateX.value = withSpring(0);
      backdropOpacity.value = withSpring(0.5);
    } else {
      drawerTranslateX.value = withSpring(drawerWidth);
      backdropOpacity.value = withSpring(0);
    }
  }, [isOpen, drawerTranslateX, backdropOpacity]);

  return (
    <>
      <Animated.View
        style={{
          pointerEvents: isOpen ? "auto" : "none",
          zIndex: 90,
          position: "absolute",
          inset: 0,
          width: screenDimensions.width,
          height: screenDimensions.height,
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
          width: drawerWidth,
          height: screenDimensions.height,
          right: 0,
        }}
      >
        <Animated.View
          {...props}
          className="p-4 bg-background-900 h-full"
          style={{
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 16,
            transform: [{ translateX: drawerTranslateX }],
          }}
        />
      </ThemedComponent>
    </>
  );
}
