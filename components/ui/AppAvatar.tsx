import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { Avatar } from "react-native-paper";

export function AppAvatar() {
  const user = useAuthUser();
	
  if (!user?.avatar?.url) {
    return <Avatar.Text size={48} label={user?.name[0].toUpperCase() || ""}></Avatar.Text>;
  }

  return (
    <Avatar.Image
      size={48}
      source={{
        uri: user.avatar.url,
      }}
    />
  );
}
