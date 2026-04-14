import React from "react";
import { View } from "react-native";

export function FormField(props: React.ComponentProps<typeof View>) {
  return <View {...props} className={`flex flex-col ${props.className}`} />;
}
