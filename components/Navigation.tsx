import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { ROUTES, useAppRouter } from "@/hooks/use-app-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Portal, PortalHost } from "@gorhom/portal";
import { Link, usePathname } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { Divider, Icon, IconButton, Text } from "react-native-paper";
import { AppAvatar } from "./ui/AppAvatar";
import { AppDrawer } from "./ui/AppDrawer";
import { AppHideableCurrencyToggle } from "./ui/AppHideableCurrencyToggle";
import { AppLayoutConstants } from "@/constants/layout";
import { AppLogoutButton } from "./ui/AppLogoutButton";

export interface DrawerNavigationItemProps {
  icon?: string;
  onPressCallback?: () => void;
  text?: string;
  to: React.ComponentProps<typeof Link>["href"];
  disabled?: boolean;
}

export interface NavigationProps {
  SubHeaderComponent?: React.ReactNode;
  hideShadow?: boolean;
  hideCurrencyToggle?: boolean;
  colored?: boolean;
}

function DrawerNavigationItem(props: DrawerNavigationItemProps) {
  const router = useAppRouter();
  const theme = useAppTheme();
  const pathname = usePathname();
  const targetPath = typeof props.to === "string" ? props.to.replace(/\/\((.*?)\)/, "") || "/" : "";
  const isActive = pathname === props.to || pathname === targetPath;

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
  const router = useAppRouter();
  const theme = useAppTheme();
  const authUserQuery = useAuthUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const authUser = useMemo(() => authUserQuery.data?.user, [authUserQuery.data]);
  const hasActiveSubscription = useMemo(() => !!authUser?.subscription?.isActive, [authUser]);

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
        <View className="px-4 flex flex-row justify-between items-center" style={{ height: AppLayoutConstants.headerHeight }}>
          <Pressable onPress={() => router.goToProfile()} style={{ backgroundColor: "transparent", borderRadius: 100 }}>
            <AppAvatar
              url={authUser?.avatar?.url}
              fallback={authUser?.name[0].toUpperCase()}
              color={contentColor}
              backgroundColor={buttonBackgroundColor}
            />
          </Pressable>

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
              url={authUser?.avatar?.url}
              fallback={authUser?.name[0].toUpperCase()}
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
                {authUser?.name}
              </Text>
              <Text variant="bodySmall">{authUser?.email}</Text>
            </View>
          </View>

          <Divider />

          <View className="grow flex flex-col">
            <DrawerNavigationItem onPressCallback={closeDrawer} to={ROUTES.home.path} icon={ROUTES.home.icon} text={ROUTES.home.title} />
            <DrawerNavigationItem
              onPressCallback={closeDrawer}
              to={ROUTES.entries.path}
              icon={ROUTES.entries.icon}
              text={ROUTES.entries.title}
            />
            <DrawerNavigationItem
              onPressCallback={closeDrawer}
              to={ROUTES.schedules.path}
              icon={ROUTES.schedules.icon}
              text={ROUTES.schedules.title}
            />
            <DrawerNavigationItem
              onPressCallback={closeDrawer}
              to={ROUTES.categories.path}
              icon={ROUTES.categories.icon}
              text={ROUTES.categories.title}
            />
            <DrawerNavigationItem
              onPressCallback={closeDrawer}
              to={ROUTES.overview.path}
              icon={ROUTES.overview.icon}
              text={ROUTES.overview.title}
            />
            <DrawerNavigationItem
              onPressCallback={closeDrawer}
              to={ROUTES.analyses.path}
              icon={ROUTES.analyses.icon}
              text={ROUTES.analyses.title}
              disabled={!hasActiveSubscription}
            />
            <DrawerNavigationItem
              onPressCallback={closeDrawer}
              to={ROUTES.chatAssistant.path}
              icon={ROUTES.chatAssistant.icon}
              text={ROUTES.chatAssistant.title}
              disabled={!hasActiveSubscription}
            />
            <DrawerNavigationItem
              onPressCallback={closeDrawer}
              to={ROUTES.profile.path}
              icon={ROUTES.profile.icon}
              text={ROUTES.profile.title}
            />
            <DrawerNavigationItem
              onPressCallback={closeDrawer}
              to={ROUTES.settings.path}
              icon={ROUTES.settings.icon}
              text={ROUTES.settings.title}
            />
          </View>

          <AppLogoutButton />
        </AppDrawer>
      </Portal>
    </>
  );
}
