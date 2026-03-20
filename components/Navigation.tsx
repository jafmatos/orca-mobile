import { Pressable, Text, View } from "@gluestack-ui/themed";
import { AppAvatar } from "./ui/AppAvatar";
import { MenuIcon } from "lucide-react-native";
import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { AppDrawer } from "./ui/AppDrawer";
import { useState } from "react";
import { Portal } from "@gorhom/portal";

export function Navigation() {
  const themeColors = useAppThemeColors();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <View
        className="h-[72px] px-4 flex flex-row justify-between items-center bg-background-950"
        style={{
          boxShadow: `0 1px 3px -5px blue`,
        }}
      >
        <AppAvatar />
        <Pressable onPress={() => setIsDrawerOpen(true)}>
          <MenuIcon size={32} color={themeColors["--color-typography-0"]} />
        </Pressable>
      </View>
      <Portal hostName="drawer">
        <AppDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
        >
          <Text>ababa</Text>
        </AppDrawer>
      </Portal>
    </>
  );
}
