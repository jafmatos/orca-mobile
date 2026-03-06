import { MaterialIcons as MaterialIcon } from "@expo/vector-icons";
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
        headerShown: false,
        tabBarPosition: "bottom",
        tabBarStyle: {
					backgroundColor: colors["--background"],
          height: 96,
          borderTopWidth: 0,
          boxShadow: `0 1px 2px 0 ${colors["--background-shadow"]}`,
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
          tabBarIcon: ({ color }) => <MaterialIcon size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="entries"
        options={{
          title: "Lançamentos",
          tabBarIcon: ({ color }) => <MaterialIcon size={28} name="receipt" color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categorias",
          tabBarIcon: ({ color }) => <MaterialIcon size={28} name="bookmark" color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Visão Geral",
          tabBarIcon: ({ color }) => <MaterialIcon size={28} name="donut-large" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Meu Perfil",
          tabBarIcon: ({ color }) => <MaterialIcon size={28} name="person" color={color} />,
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
