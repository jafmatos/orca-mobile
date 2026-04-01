import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { HomeIcon, ReceiptTextIcon, BookmarkIcon, ChartPieIcon, UserIcon } from "lucide-react-native";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Navigation } from "@/components/Navigation";
import { KeyboardAvoidingComponent } from "@/components/KeyboardAvoindingComponent";
import { PortalHost, PortalProvider } from "@gorhom/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemedComponent } from "@/components/ThemedComponent";

export default function TabLayout() {
  const colors = useAppThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <GestureHandlerRootView>
      <PortalProvider>
        <ThemedComponent className="grow">
          <ThemedComponent.Background />

          <KeyboardAvoidingComponent
            style={{
              position: "relative",
              paddingTop: insets.top,
              backgroundColor: "none",
            }}
          >
            <Navigation />

            <Tabs
              screenOptions={{
                tabBarActiveTintColor: colors["--color-primary-400"],
                tabBarInactiveTintColor: colors["--color-typography-0"],
                headerShown: false,
                tabBarPosition: "bottom",
                tabBarStyle: {
                  backgroundColor: colors["--color-background-950"],
                  height: 80 + insets.bottom,
                  borderTopWidth: 0,
                  boxShadow: `0 -1px 1px -1px ${colors["--color-outline-700"]}`,
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
          </KeyboardAvoidingComponent>

          <PortalHost name="bottomsheet" />
          <PortalHost name="drawer" />
        </ThemedComponent>
      </PortalProvider>
    </GestureHandlerRootView>
  );
}
