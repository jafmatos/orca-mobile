import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { HomeIcon, ReceiptTextIcon, BookmarkIcon, ChartPieIcon, UserIcon, View } from "lucide-react-native";
import { Tabs } from "expo-router";
import React from "react";
import { Navigation } from "@/components/Navigation";
import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { PortalHost } from "@gorhom/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
import { SafeAreaComponent } from "@/components/SafeAreaComponent";

export default function TabLayout() {
  const theme = useTheme();
  const colors = useAppThemeColors();

  return (
    <GestureHandlerRootView>
      <KeyboardAvoidingComponent
        style={{
          position: "relative",
          backgroundColor: theme.colors.background,
        }}
      >
        <SafeAreaComponent className="grow" keyboardHandled>
          <Navigation />

          <Tabs
            screenOptions={{
              tabBarActiveTintColor: colors["--color-primary-400"],
              tabBarInactiveTintColor: colors["--color-typography-0"],
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
                tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name="entries"
              options={{
                title: "Lançamentos",
                tabBarIcon: ({ color }) => <ReceiptTextIcon size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name="categories"
              options={{
                title: "Categorias",
                tabBarIcon: ({ color }) => <BookmarkIcon size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name="dashboard"
              options={{
                title: "Visão Geral",
                tabBarIcon: ({ color }) => <ChartPieIcon size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: "Meu Perfil",
                tabBarIcon: ({ color }) => <UserIcon size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name="limits"
              options={{
                title: "Limites",
                href: null,
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
      <PortalHost name="bottomsheet" />
      <PortalHost name="fullscreen-overlay" />
      <PortalHost name="modal" />
      <PortalHost name="select" />
    </GestureHandlerRootView>
  );
}
