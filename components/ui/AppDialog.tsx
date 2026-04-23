import React from "react";
import Animated from "react-native-reanimated";
import { AppModal } from "./AppModal";
import { View } from "react-native";
import { Text } from "react-native-paper";

export interface AppDialogProps extends React.ComponentProps<typeof Animated.View> {
  isOpen: boolean;
  onClose: () => void;
  modalProps?: React.ComponentProps<typeof AppModal>;
}

function AppDialogTitle(props: React.ComponentProps<typeof Text>) {
  return (
    <Text className="px-6" variant="titleMedium">
      {props.children}
    </Text>
  );
}

function AppDialogContent(props: React.ComponentProps<typeof View>) {
  return (
    <Text className="px-6" variant="bodyMedium">
      {props.children}
    </Text>
  );
}

function AppDialogActions(props: React.ComponentProps<typeof View>) {
  return (
    <View
      className="p-2 flex flex-row gap-2"
      style={{
        justifyContent: "flex-end",
      }}
    >
      {props.children}
    </View>
  );
}

export function AppDialog(props: AppDialogProps) {
  return (
    <AppModal
      isOpen={props.isOpen}
      onClose={props.onClose}
      {...props.modalProps}
      className="flex flex-col gap-2"
      style={{
        paddingTop: 16,
      }}
    >
      {props.children}
    </AppModal>
  );
}

AppDialog.Title = AppDialogTitle;
AppDialog.Content = AppDialogContent;
AppDialog.Actions = AppDialogActions;
