import { useAuthUser } from "@/hooks/queries/use-auth-user";
import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { Avatar, AvatarFallbackText, AvatarImage } from "@gluestack-ui/themed";

export function AppAvatar() {
  const user = useAuthUser();
  const themeColors = useAppThemeColors();
  const fallbackColor = [
    themeColors["--color-avatar-bg-1"],
    themeColors["--color-avatar-bg-2"],
    themeColors["--color-avatar-bg-3"],
    themeColors["--color-avatar-bg-4"],
    themeColors["--color-avatar-bg-5"],
    themeColors["--color-avatar-bg-6"],
    themeColors["--color-avatar-bg-7"],
    themeColors["--color-avatar-bg-8"],
    themeColors["--color-avatar-bg-9"],
    themeColors["--color-avatar-bg-10"],
  ][Math.floor(Math.random() * 10)];

  return (
    <Avatar size="md" backgroundColor={fallbackColor}>
      {user?.avatar?.url ? (
        <AvatarImage
          source={{
            uri: user.avatar.url,
          }}
        />
      ) : (
        <AvatarFallbackText>{user?.name}</AvatarFallbackText>
      )}
    </Avatar>
  );
}
