import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { SafeAreaComponent } from "@/components/SafeAreaComponent";
import { PortalHost } from "@gorhom/portal";
import { Tabs, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
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
  const statusBarStyle = useMemo(
    () => (isHomeScreen ? (theme.dark ? "dark" : "light") : theme.dark ? "light" : "dark"),
    [isHomeScreen, theme],
  );

  return (
    <GestureHandlerRootView>
      <StatusBar style={statusBarStyle} backgroundColor="transparent" translucent />

      <KeyboardAvoidingComponent
        style={{
          position: "relative",
          backgroundColor: theme.colors.background,
        }}
      >
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: insets.top, backgroundColor: topSafeAreaBg, zIndex: 1 }} />

        <SafeAreaComponent className="grow">
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
              name="index"
              options={{
                title: "Início",
                tabBarIcon: ({ color }) => <Icon source="home" size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name="entries"
              options={{
                title: "Lançamentos",
                tabBarIcon: ({ color }) => <Icon source="receipt-text" size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name="categories"
              options={{
                title: "Categorias",
                tabBarIcon: ({ color }) => <Icon source="bookmark" size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name="overview"
              options={{
                title: "Visão Geral",
                tabBarIcon: ({ color }) => <Icon source="chart-donut" size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: "Meu Perfil",
                tabBarIcon: ({ color }) => <Icon source="account" size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name="schedules"
              options={{
                title: "Agendamentos",
                href: null,
              }}
            />
            <Tabs.Screen
              name="analyses"
              options={{
                title: "Análises",
                href: null,
              }}
            />
          </Tabs>
        </SafeAreaComponent>
      </KeyboardAvoidingComponent>

      <PortalHost name="drawer" />
      <PortalHost name="search-overlay" />
      <PortalHost name="bottomsheet" />
      <PortalHost name="fullscreen-overlay" />
      <PortalHost name="modal" />
      <PortalHost name="select" />
    </GestureHandlerRootView>
  );
}
