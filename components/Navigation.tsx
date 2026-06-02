import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { useAppRouter } from "@/hooks/use-app-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import { Portal, PortalHost } from "@gorhom/portal";
import { Link, usePathname } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Button, Divider, Icon, IconButton, Text } from "react-native-paper";
import { AppAvatar } from "./ui/AppAvatar";
import { AppDrawer } from "./ui/AppDrawer";
import { AppHideableCurrencyToggle } from "./ui/AppHideableCurrencyToggle";

export interface DrawerNavigationItemProps {
  icon?: string;
  onPressCallback?: () => void;
  text: string;
  to: React.ComponentProps<typeof Link>["href"];
}

export interface NavigationProps {
  SubHeaderComponent?: React.ReactNode;
}

function DrawerNavigationItem(props: DrawerNavigationItemProps) {
  const router = useAppRouter();
  const theme = useAppTheme();
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
        {props.icon ? <Icon size={18} source={props.icon} color={isActive ? theme.colors.primary : theme.colors.onBackground} /> : <></>}
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

export function Navigation(props?: NavigationProps) {
  const theme = useAppTheme();
  const router = useAppRouter();
  const user = useAuthUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <View
        className="flex"
        style={{
          backgroundColor: theme.colors.background,
          boxShadow: `0 1px 1px -1px ${theme.colors.outlineVariant}`,
          zIndex: 1,
        }}
      >
        <View className="h-[72px] px-4 flex flex-row justify-between items-center">
          <AppAvatar url={user?.avatar?.url} fallback={user?.name[0].toUpperCase()} />

          <View className="flex flex-row items-center gap-4">
            <AppHideableCurrencyToggle size={24} />

            <IconButton icon="menu" onPress={() => setIsDrawerOpen(true)} size={32} style={{ margin: 0 }} />
          </View>
        </View>

        <PortalHost name="sub-navigation" />
        {props?.SubHeaderComponent}
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
            <AppAvatar url={user?.avatar?.url} fallback={user?.name[0].toUpperCase()} />

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
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/"} icon="home" text="Início" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/entries"} icon="receipt-text" text="Lançamentos" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/schedules"} icon="clock" text="Agendamentos" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/categories"} icon="bookmark" text="Categorias" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/overview"} icon="chart-donut" text="Visão Geral" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/analyses"} icon="creation" text="Análises" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/profile"} icon="account" text="Meu Perfil" />
          </View>

          <Button
            mode="contained"
            icon="logout"
            buttonColor={theme.colors.error}
            textColor={theme.colors.onError}
            style={{ borderRadius: theme.roundness }}
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
