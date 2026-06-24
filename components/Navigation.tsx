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
import { AppLayoutConstants } from "@/constants/layout";

export interface DrawerNavigationItemProps {
  icon?: string;
  onPressCallback?: () => void;
  text: string;
  to: React.ComponentProps<typeof Link>["href"];
  disabled?: boolean;
}

export interface NavigationProps {
  SubHeaderComponent?: React.ReactNode;
  backgroundColor?: string;
  contentColor?: string;
  hideShadow?: boolean;
  hideCurrencyToggle?: boolean;
  colored?: boolean;
}

function DrawerNavigationItem(props: DrawerNavigationItemProps) {
  const router = useAppRouter();
  const theme = useAppTheme();
  const pathname = usePathname();
  const isActive = pathname === props.to;

  return (
    <Pressable
      disabled={props.disabled}
      onPress={() => {
        router.push(props.to);

        props.onPressCallback?.();
      }}
    >
      <View className={`relative w-full p-4 flex flex-row items-center gap-3`} style={{ opacity: props.disabled ? 0.5 : 1 }}>
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

export function Navigation(props: NavigationProps) {
  const theme = useAppTheme();
  const router = useAppRouter();
  const user = useAuthUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const hasActiveSubscription = !!user?.subscription && ["active", "trialing"].includes(user.subscription.status);

  const closeDrawer = () => setIsDrawerOpen(false);

  const backgroundColor = props?.colored ? theme.colors.primary : theme.colors.background;
  const contentColor = props?.colored ? theme.colors.onPrimary : theme.colors.onBackground;
  const buttonBackgroundColor = props?.colored ? "rgba(255, 255, 255, 0.15)" : theme.colors.backdrop;

  return (
    <>
      <View
        className="flex"
        style={{
          backgroundColor,
          boxShadow: props?.hideShadow ? "none" : `0 1px 1px -1px ${theme.colors.outlineVariant}`,
          zIndex: 1,
        }}
      >
        <View
          className="px-4 flex flex-row justify-between items-center"
          style={{ height: AppLayoutConstants.headerHeight }}
        >
          <View style={{ backgroundColor: "transparent", borderRadius: 100 }}>
            <AppAvatar
              url={user?.avatar?.url}
              fallback={user?.name[0].toUpperCase()}
              color={contentColor}
              backgroundColor={buttonBackgroundColor}
            />
          </View>

          <View className="flex flex-row items-center gap-3">
            {!props.hideCurrencyToggle ? (
              <AppHideableCurrencyToggle
                size={22}
                color={contentColor}
                style={{
                  backgroundColor: buttonBackgroundColor,
                  borderRadius: 100,
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            ) : (
              <></>
            )}

            <IconButton
              icon="menu"
              onPress={() => setIsDrawerOpen(true)}
              size={24}
              iconColor={contentColor}
              containerColor={buttonBackgroundColor}
              style={{ margin: 0, width: 44, height: 44 }}
            />
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
            <AppAvatar
              url={user?.avatar?.url}
              fallback={user?.name[0].toUpperCase()}
              color={theme.colors.onBackground}
              backgroundColor={theme.colors.backdrop}
            />

            <View style={{ flexShrink: 1, gap: 4 }} className="flex flex-col">
              <Text
                variant="titleSmall"
                ellipsizeMode="tail"
                numberOfLines={1}
                style={{
                  flexShrink: 1,
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
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/analyses"} icon="creation" text="Análises" disabled={!hasActiveSubscription} />
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
