import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { View } from "react-native";

export interface AppTabHeaderProps extends React.ComponentProps<typeof View> {
  SubHeaderComponent?: React.ReactNode;
}

export function AppTabHeader(props: AppTabHeaderProps) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        boxShadow: `0 1px 1px -1px ${theme.colors.outlineVariant}`,
        zIndex: 1,
      }}
    >
      <View className="flex flex-col">
        <View {...props} className={`p-4 w-full flex flex-row items-center justify-between ${props.className}`}>
          {props.children}
        </View>
        {props.SubHeaderComponent}
      </View>
    </View>
  );
}
