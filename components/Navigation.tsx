import { AppAvatar } from "./ui/AppAvatar";
import {
  LucideIcon,
  MenuIcon,
  HomeIcon,
  ReceiptTextIcon,
  BookmarkIcon,
  ChartPieIcon,
  UserIcon,
  OctagonAlertIcon,
  ClockIcon,
  SparklesIcon,
} from "lucide-react-native";
import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { AppDrawer } from "./ui/AppDrawer";
import { useState } from "react";
import { Portal } from "@gorhom/portal";
import { Link, usePathname } from "expo-router";
import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { Pressable, View } from "react-native";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import { Button, Divider, Text, useTheme } from "react-native-paper";
import { useAppRouter } from "@/hooks/use-app-router";

interface DrawerNavigationItemProps {
  icon?: LucideIcon;
  onPressCallback?: () => void;
  text: string;
  to: React.ComponentProps<typeof Link>["href"];
}

function DrawerNavigationItem({ icon: Icon, ...props }: DrawerNavigationItemProps) {
  const router = useAppRouter();
  const theme = useTheme();
  const pathname = usePathname();
  const isActive = pathname === props.to;

  return (
    <Pressable
      onPress={() => {
        router.push(props.to);

        props.onPressCallback?.();
      }}
    >
      <View className={`relative w-full p-4 flex flex-row items-center gap-3`}>
        {Icon ? <Icon size={18} color={isActive ? theme.colors.primary : theme.colors.onBackground} /> : <></>}
        <Text
          variant="labelLarge"
          style={{
            color: isActive ? theme.colors.primary : theme.colors.onBackground,
          }}
        >
          {props.text}
        </Text>
      </View>
    </Pressable>
  );
}

export function Navigation() {
  const theme = useTheme();
  const router = useAppRouter();
  const user = useAuthUser();
  const themeColors = useAppThemeColors();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <View
        className="h-[72px] px-4 flex flex-row justify-between items-center"
        style={{
          backgroundColor: theme.colors.background,
          borderBottomWidth: 0,
          borderBottomColor: theme.colors.outlineVariant,
          boxShadow: `0 1px 1px -1px ${theme.colors.outlineVariant}`,
          zIndex: 1,
        }}
      >
        <AppAvatar />
        <Pressable onPress={() => setIsDrawerOpen(true)}>
          <MenuIcon size={32} color={themeColors["--color-typography-0"]} />
        </Pressable>
      </View>
      <Portal hostName="drawer">
        <AppDrawer
          className="p-6 flex flex-col gap-4"
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
        >
          <View className="flex flex-row gap-2 items-center">
            <AppAvatar />
            <View style={{ flexShrink: 1, gap: 4 }} className="flex flex-col">
              <Text
                variant="titleSmall"
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{
                  color: theme.colors.onBackground,
                }}
              >
                {user?.name}
              </Text>
              <Text variant="bodySmall">{user?.email}</Text>
            </View>
          </View>
          <Divider />
          <View className="grow flex flex-col">
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/"} icon={HomeIcon} text="Início" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/entries"} icon={ReceiptTextIcon} text="Lançamentos" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/schedules"} icon={ClockIcon} text="Agendamentos" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/categories"} icon={BookmarkIcon} text="Categorias" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/limits"} icon={OctagonAlertIcon} text="Limites" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/dashboard"} icon={ChartPieIcon} text="Visão Geral" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/analyses"} icon={SparklesIcon} text="Análises" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/profile"} icon={UserIcon} text="Meu Perfil" />
          </View>
          <Button
            icon="LogOut"
            mode="contained-tonal"
            buttonColor={theme.colors.error}
            textColor={theme.colors.onError}
            onPress={() => {
              AppAuthenticationTokenStore.remove();

              router.goToSignIn();
            }}
          >
            Sair
          </Button>
        </AppDrawer>
      </Portal>
    </>
  );
}
