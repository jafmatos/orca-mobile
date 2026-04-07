import React from "react";
import Animated from "react-native-reanimated";
import { AppModal } from "./AppModal";
import { View } from "react-native";
import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { AppText } from "./AppText";

export interface AppDialogProps extends React.ComponentProps<typeof Animated.View> {
  isOpen: boolean;
  onClose: () => void;
  modalProps?: React.ComponentProps<typeof AppModal>;
}

function AppDialogTitle(props: React.ComponentProps<typeof AppText>) {
  const themeColors = useAppThemeColors();

  return (
    <AppText className="px-6" style={{ fontSize: 18, fontWeight: 600, color: themeColors["--color-typography-0"] }}>
      {props.children}
    </AppText>
  );
}

function AppDialogContent(props: React.ComponentProps<typeof View>) {
  const themeColors = useAppThemeColors();

  return (
    <View>
      <AppText className="px-6" style={{ fontSize: 15, fontWeight: 400, color: themeColors["--color-typography-200"] }}>
        {props.children}
      </AppText>
    </View>
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
