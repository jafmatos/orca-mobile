import { IconSymbol } from "@/components/ui/icon-symbol";
import useAppTheme from "@/hooks/use-app-theme";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const [, colors] = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors["--primary"],
        tabBarInactiveTintColor: colors["--text-secondary"],
        tabBarActiveBackgroundColor: colors["--background"],
        tabBarInactiveBackgroundColor: colors["--background"],
        headerShown: false,
        tabBarPosition: "bottom",
        tabBarStyle: {
          borderTopWidth: 0,
          boxShadow: `0 1px 2px 0 ${colors["--background-shadow"]}`,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="entries"
        options={{
          title: "Lançamentos",
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categorias",
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Visão Geral",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Meu Perfil",
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
    </Tabs>
  );
}
