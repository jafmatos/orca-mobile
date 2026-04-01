import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { LucideIcon } from "lucide-react-native";
import { Pressable } from "react-native";

export interface AppIconButtonProps extends React.ComponentProps<typeof Pressable> {
  as: LucideIcon;
  color?: string;
}

export function AppIconButton({ as: Icon, ...props }: AppIconButtonProps) {
  const themeColors = useAppThemeColors();

  return (
    <Pressable {...props} style={{ padding: 12, borderRadius: 16, backgroundColor: themeColors["--color-background-700"] }}>
      <Icon color={props.color} size={18} />
    </Pressable>
  );
}
