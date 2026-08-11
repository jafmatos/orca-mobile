import { AppKeyboardAvoidingComponent } from "@/components/utils/AppKeyboardAvoidingComponent";
import { AppSafeAreaComponent } from "@/components/utils/AppSafeAreaComponent";
import { ROUTES } from "@/hooks/use-app-router";
import { PortalHost } from "@gorhom/portal";
import { Tabs, usePathname } from "expo-router";
import React, { useMemo } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Icon, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const isHomeScreen = useMemo(() => pathname === "/" || pathname === "", [pathname]);
  const topSafeAreaBg = useMemo(() => (isHomeScreen ? theme.colors.primary : theme.colors.background), [isHomeScreen, theme]);

  return (
    <GestureHandlerRootView>
      <AppKeyboardAvoidingComponent
        style={{
          position: "relative",
          backgroundColor: theme.colors.background,
        }}
      >
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: insets.top, backgroundColor: topSafeAreaBg, zIndex: 1 }} />

        <AppSafeAreaComponent className="grow">
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: theme.colors.onBackground,
              headerShown: false,
              tabBarPosition: "bottom",
              tabBarStyle: {
                backgroundColor: theme.colors.background,
                height: 80,
                paddingBottom: 0,
                borderTopWidth: 0,
                boxShadow: `0 -1px 1px -1px ${theme.colors.outlineVariant}`,
                elevation: 0,
                shadowOpacity: 0,
                shadowOffset: { height: 0, width: 0 },
              },
              tabBarItemStyle: {
                alignItems: "center",
                flexDirection: "row",
              },
            }}
          >
            <Tabs.Screen
              name={ROUTES.home.name}
              options={{
                title: ROUTES.home.title,
                tabBarIcon: ({ color }) => <Icon source={ROUTES.home.icon} size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name={ROUTES.entries.name}
              options={{
                title: ROUTES.entries.title,
                tabBarIcon: ({ color }) => <Icon source={ROUTES.entries.icon} size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name={ROUTES.categories.name}
              options={{
                title: ROUTES.categories.title,
                href: null,
              }}
            />
            <Tabs.Screen
              name={ROUTES.overview.name}
              options={{
                title: ROUTES.overview.title,
                tabBarIcon: ({ color }) => <Icon source={ROUTES.overview.icon} size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name={ROUTES.profile.name}
              options={{
                title: ROUTES.profile.title,
                href: null,
              }}
            />
            <Tabs.Screen
              name={ROUTES.schedules.name}
              options={{
                title: ROUTES.schedules.title,
                href: null,
              }}
            />
            <Tabs.Screen
              name={ROUTES.analyses.name}
              options={{
                title: ROUTES.analyses.title,
                href: null,
              }}
            />
          </Tabs>
        </AppSafeAreaComponent>
      </AppKeyboardAvoidingComponent>

      <PortalHost name="drawer" />
      <PortalHost name="search-overlay" />
      <PortalHost name="bottomsheet" />
      <PortalHost name="fullscreen-overlay" />
      <PortalHost name="modal" />
      <PortalHost name="select" />
    </GestureHandlerRootView>
  );
}
