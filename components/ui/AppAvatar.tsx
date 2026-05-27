import { Avatar } from "react-native-paper";

export interface AppAvatarProps {
  url?: string;
  fallback?: string;
}

export function AppAvatar(props: AppAvatarProps) {
  if (!props.url) {
    return <Avatar.Text size={48} label={props.fallback || ""}></Avatar.Text>;
  }

  return (
    <Avatar.Image
      size={48}
      source={{
        uri: props.url,
      }}
    />
  );
}
