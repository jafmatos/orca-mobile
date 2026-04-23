import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

function FormFieldLabel(props: React.ComponentProps<typeof Text>) {
  return <Text {...props} variant="labelLarge" />;
}

export function FormField(props: React.ComponentProps<typeof View>) {
  return <View {...props} className={`flex flex-col ${props.className}`} />;
}

FormField.Label = FormFieldLabel;
