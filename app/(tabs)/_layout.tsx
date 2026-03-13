import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { MaterialIcons as MaterialIcon } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const colors = useAppThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors["--color-primary-400"],
        tabBarInactiveTintColor: colors["--color-grey-600"],
        headerShown: false,
        tabBarPosition: "bottom",
        tabBarStyle: {
          backgroundColor: colors["--color-background-950"],
          height: 80 + insets.bottom,
          paddingBottom: insets.bottom,
          borderTopWidth: 0,
          boxShadow: `0 -1px 2px -1px ${colors["--color-outline-700"]}`,
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
