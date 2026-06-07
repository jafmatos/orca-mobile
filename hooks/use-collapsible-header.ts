import { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolation } from "react-native-reanimated";

export function useCollapsibleHeader(maxHeaderHeight: number = 80) {
  const scrollY = useSharedValue(0);
  const clampedScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentScrollY = event.contentOffset.y;
      const diff = currentScrollY - scrollY.value;

      let newValue = clampedScrollY.value + diff;
      
      if (currentScrollY < 0) {
        newValue = 0;
      } else {
        newValue = Math.max(0, Math.min(newValue, maxHeaderHeight));
      }

      clampedScrollY.value = newValue;
      scrollY.value = currentScrollY;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      clampedScrollY.value,
      [0, maxHeaderHeight],
      [maxHeaderHeight, 0],
      Extrapolation.CLAMP
    );
    
    const opacity = interpolate(
      clampedScrollY.value,
      [0, maxHeaderHeight / 1.5],
      [1, 0],
      Extrapolation.CLAMP
    );

    return {
      height,
      opacity,
      overflow: 'hidden',
    };
  });

  return { scrollHandler, headerAnimatedStyle };
}
