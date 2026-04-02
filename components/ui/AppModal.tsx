import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { Portal } from "@gorhom/portal";
import React, { useEffect } from "react";
import { Dimensions, Pressable } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface AppModalProps extends React.ComponentProps<typeof Animated.View> {
  isOpen: boolean;
  backdropOpacity?: number;
  backdropColor?: string;
  onClose: () => void;
}

export function AppModal({ backdropColor = "#000000", backdropOpacity = 0.5, ...props }: AppModalProps) {
  const insets = useSafeAreaInsets();
  const themeColors = useAppThemeColors();
  const screenDimensions = Dimensions.get("screen");
  const SCREEN_WIDTH = screenDimensions.width;
  const SCREEN_HEIGHT = screenDimensions.height;
  const backdropOpacitySharedValue = useSharedValue(props.isOpen ? backdropOpacity : 0);
  const modalOpacitySharedValue = useSharedValue(props.isOpen ? 1 : 0);

  useEffect(() => {
    if (props.isOpen) {
      backdropOpacitySharedValue.value = withSpring(backdropOpacity);
      modalOpacitySharedValue.value = withSpring(1);
    } else {
      backdropOpacitySharedValue.value = withSpring(0);
      modalOpacitySharedValue.value = withSpring(0);
    }
  }, [props.isOpen, backdropOpacitySharedValue, modalOpacitySharedValue, backdropOpacity]);

  return (
    <Portal hostName="modal">
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          pointerEvents: props.isOpen ? "auto" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.View
          className="w-full h-full"
          style={{
            position: "absolute",
            backgroundColor: backdropColor,
            opacity: backdropOpacitySharedValue,
          }}
        >
          <Pressable className="w-full h-full" onPress={props.onClose} />
        </Animated.View>
        <Animated.View
          style={[
            {
              pointerEvents: "auto",
              opacity: modalOpacitySharedValue,
              width: SCREEN_WIDTH * 0.85,
              maxWidth: 384,
              borderRadius: 8,
              boxShadow: `0 3px 7px 0 rgba(0, 0, 0, 0.5)`,
              backgroundColor: themeColors["--color-background-800"],
            },
            props.style,
          ]}
          className={props.className}
        >
          {props.children}
        </Animated.View>
      </Animated.View>
    </Portal>
  );
}
