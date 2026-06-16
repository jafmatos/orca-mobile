import { useAppTheme } from "@/hooks/use-app-theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Modal, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

const PHRASES = [
  "Lendo suas transações recentes...",
  "Analisando seus gastos por categoria...",
  "Identificando possíveis vazamentos de caixa...",
  "Procurando oportunidades de economia...",
  "Escrevendo recomendações personalizadas...",
];

export function AIAnalysisGenerationLoadingOverlay({ visible }: { visible: boolean }) {
  const theme = useAppTheme();
  const [phraseIndex, setPhraseIndex] = useState(0);

  const scale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      setPhraseIndex(0);
      const interval = setInterval(() => {
        setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
      }, 3000);

      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );

      return () => {
        clearInterval(interval);
        scale.value = 1;
      };
    }
  }, [visible, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center px-8" style={{ backgroundColor: theme.colors.background }}>
        <Animated.View style={animatedStyle}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.tertiary]}
            style={{ borderRadius: 24, padding: 24, justifyContent: "center", alignItems: "center", marginBottom: 16 }}
          >
            <Icon source="robot-outline" size={48} color={theme.colors.onPrimary} />
          </LinearGradient>
        </Animated.View>

        <Text variant="headlineSmall" style={{ color: theme.colors.onBackground, fontWeight: "900", marginTop: 40, textAlign: "center" }}>
          O Antônio está trabalhando...
        </Text>
		
        <Text
          variant="bodyLarge"
          style={{ color: theme.colors.onSurfaceVariant, marginTop: 16, textAlign: "center", minHeight: 48, fontStyle: "italic" }}
        >
          "{PHRASES[phraseIndex]}"
        </Text>
      </View>
    </Modal>
  );
}
