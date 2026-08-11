import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

function AppFormFieldLabel(props: React.ComponentProps<typeof Text>) {
  return <Text {...props} variant="labelLarge" />;
}

export function AppFormField(props: React.ComponentProps<typeof View>) {
  return <View {...props} className={`flex flex-col gap-1 ${props.className}`} />;
}

AppFormField.Label = AppFormFieldLabel;
