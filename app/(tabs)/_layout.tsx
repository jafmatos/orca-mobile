import { Tabs } from "expo-router";
import React from "react";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
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
