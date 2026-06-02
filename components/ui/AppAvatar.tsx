import { Avatar } from "react-native-paper";

export interface AppAvatarProps {
  url?: string;
  fallback?: string;
  size?: number;
}

export function AppAvatar({ size = 48, url, fallback }: AppAvatarProps) {
  if (!url) {
    return <Avatar.Text size={size} label={fallback?.[0].toUpperCase() || ""} />;
  }

  return <Avatar.Image size={size} source={{ uri: url }} />;
}
