import React from "react";
import { View } from "react-native";

export function AppFabOverlay(props: React.ComponentProps<typeof View>) {
  return (
    <View
      style={{
        position: "absolute",
        zIndex: 50,
        right: 0,
        bottom: 0,
        margin: 16,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        gap: 16,
      }}
    >
      {props.children}
    </View>
  );
}
