import { useAppTheme } from "@/hooks/use-app-theme";
import { Avatar } from "react-native-paper";

export interface AppAvatarProps {
  url?: string;
  fallback?: string;
  size?: number;
  backgroundColor?: string;
  color?: string;
}

export function AppAvatar({ size = 48, url, fallback, backgroundColor, color }: AppAvatarProps) {
  const theme = useAppTheme();

  if (!url) {
    return (
      <Avatar.Text
        size={size}
        label={fallback?.[0].toUpperCase() || ""}
        color={color || theme.colors.onBackground}
        style={{ backgroundColor: backgroundColor || theme.colors.backdrop, borderRadius: size / 2 }}
      />
    );
  }

  return <Avatar.Image size={size} source={{ uri: url }} />;
}
