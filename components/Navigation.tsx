import { View } from "@gluestack-ui/themed";
import { AppAvatar } from "./ui/AppAvatar";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import useAppThemeColors from "@/hooks/use-app-theme-colors";

export function Navigation() {
  const themeColors = useAppThemeColors();

  return (
    <View
      className="relative h-[72px] px-4 flex flex-row justify-between items-center"
      style={{
        height: 72,
        boxShadow: `0 1px 2px -1px ${themeColors["--color-outline-700"]}`,
      }}
    >
      <AppAvatar />
      <TouchableOpacity>
        <MaterialIcons name="menu" size={32} color={themeColors["--color-background-500"]} />
      </TouchableOpacity>
    </View>
  );
}
