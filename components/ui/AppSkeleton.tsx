import { useAppTheme } from "@/hooks/use-app-theme";
import { useCallback, useEffect } from "react";
import Animated, { useSharedValue, withRepeat, withSpring, withTiming } from "react-native-reanimated";
import { scheduleOnUI } from "react-native-worklets";

export interface AppSkeletonProps {
  height?: number;
  width?: number;
  color?: string;
  fromOpacity?: number;
  toOpacity?: number;
}

export function AppSkeleton({ fromOpacity = 0.3, toOpacity = 0.8, ...props }: AppSkeletonProps) {
  const theme = useAppTheme();
  const opacitySharedValue = useSharedValue(fromOpacity);

  const initializeAnimation = useCallback(() => {
    "worklet";

    opacitySharedValue.value = withRepeat(withTiming(toOpacity, { duration: 1250 }), -1, true);
  }, [opacitySharedValue, toOpacity]);

  useEffect(() => {
    scheduleOnUI(initializeAnimation);
  }, [initializeAnimation]);

  return (
    <Animated.View
      style={{
        borderRadius: theme.roundness,
        opacity: opacitySharedValue,
        backgroundColor: props.color || theme.colors.surfaceVariant,
        height: props.height || "100%",
        width: props.width || "100%",
      }}
    />
  );
}
