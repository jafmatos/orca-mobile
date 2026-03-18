import { View } from "@gluestack-ui/themed";
import { AppAvatar } from "./ui/AppAvatar";
import { TouchableOpacity } from "react-native";
import { MenuIcon } from "lucide-react-native";
import useAppThemeColors from "@/hooks/use-app-theme-colors";

export function Navigation() {
  const themeColors = useAppThemeColors();

  return (
    <View
      className="relative h-[72px] px-4 flex flex-row justify-between items-center bg-background-950"
      style={{
        height: 72,
        boxShadow: `0 1px 3px -2px ${themeColors["--color-outline-700"]}`,
      }}
    >
      <AppAvatar />
      <TouchableOpacity>
        <MenuIcon size={32} color={themeColors["--color-typography-0"]} />
      </TouchableOpacity>
    </View>
  );
}
