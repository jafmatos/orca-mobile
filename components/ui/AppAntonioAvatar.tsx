import { useAppTheme } from "@/hooks/use-app-theme";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { Icon } from "react-native-paper";

export interface AppAntonioAvatarProps extends React.ComponentProps<typeof View> {
  size?: "small" | "medium" | "large";
}

export function AppAntonioAvatar({ size = "medium", ...props }: AppAntonioAvatarProps) {
  const theme = useAppTheme();

  let iconSize = 32;
  let padding = 12;

  if (size === "small") {
    iconSize = 24;
    padding = 12;
  }

  if (size === "large") {
    iconSize = 48;
    padding = 24;
  }

  return (
    <View {...props}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.tertiary]}
        style={{ borderRadius: iconSize / 2, padding, justifyContent: "center", alignItems: "center" }}
      >
        <Icon source="robot-outline" size={iconSize} color={theme.colors.onPrimary} />
      </LinearGradient>
    </View>
  );
}
