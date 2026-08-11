import { useAppTheme } from "@/hooks/use-app-theme";
import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

const AnimatedAudioBar = ({ delay }: { delay: number }) => {
  const height = useSharedValue(4);
  const theme = useAppTheme();

  useEffect(() => {
    const timeout = setTimeout(() => {
      height.value = withRepeat(
        withSequence(
          withTiming(Math.random() * 12 + 8, { duration: 300 + Math.random() * 200, easing: Easing.inOut(Easing.ease) }),
          withTiming(4, { duration: 300 + Math.random() * 200, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return <Animated.View style={[{ width: 3, backgroundColor: theme.colors.error, borderRadius: 2, marginHorizontal: 2 }, animatedStyle]} />;
};

export function AppAudioWaveIndicator({ staticWave = false }: { staticWave?: boolean }) {
  const theme = useAppTheme();

  const staticHeights = useMemo(() => [4, 6, 8, 12, 16, 10, 8, 14, 18, 12, 6, 8, 4, 10, 6, 14, 10, 6, 4, 8, 12, 6, 4], []);

  if (staticWave) {
    return (
      <View className="flex flex-row items-center h-6">
        {staticHeights.map((height, index) => (
          <View
            key={index}
            style={{
              height: height,
              width: 3,
              backgroundColor: theme.colors.outlineVariant,
              borderRadius: 2,
              marginHorizontal: 1.5,
            }}
          />
        ))}
      </View>
    );
  }

  return (
    <View className="flex flex-row items-center justify-center h-6">
      <AnimatedAudioBar delay={0} />
      <AnimatedAudioBar delay={100} />
      <AnimatedAudioBar delay={250} />
      <AnimatedAudioBar delay={150} />
      <AnimatedAudioBar delay={50} />
    </View>
  );
}
