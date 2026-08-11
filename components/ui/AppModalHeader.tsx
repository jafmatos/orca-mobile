import { useAppRouter } from "@/hooks/use-app-router";
import React from "react";
import { View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { AppConditional } from "../utils/AppConditional";
import { AppKeyboardDismissing } from "../utils/AppKeyboardDismissing";

export interface AppModalHeaderProps {
  title?: string;
  HeaderComponent?: React.ReactNode;
  HeaderRightComponent?: React.ReactNode;
  onBackPress?: () => void;
}

export function AppModalHeader(props: AppModalHeaderProps) {
  const theme = useTheme();
  const router = useAppRouter();

  const handleBackPress = () => {
    if (props.onBackPress) {
      props.onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      className="px-4 h-[72px] flex flex-row gap-2 items-center"
      style={{
        backgroundColor: theme.colors.surface,
        boxShadow: `0 1px 3px -2px ${theme.colors.outlineVariant}`,
      }}
    >
      <AppKeyboardDismissing.View>
        <AppConditional
          if={!!props.HeaderComponent}
          _then={props.HeaderComponent}
          _else={
            <View className="flex-row gap-2 items-center flex-1 justify-between">
              <View className="flex-row gap-2 items-center flex-1 pr-4">
                <IconButton
                  size={24}
                  style={{ marginLeft: 0, width: 44, height: 44 }}
                  iconColor={theme.colors.onBackground}
                  icon="arrow-left"
                  onPress={handleBackPress}
                />

                <Text variant="titleLarge" numberOfLines={1} style={{ flexShrink: 1 }}>
                  {props.title ?? ""}
                </Text>
              </View>
              {props.HeaderRightComponent && <View>{props.HeaderRightComponent}</View>}
            </View>
          }
        />
      </AppKeyboardDismissing.View>
    </View>
  );
}
