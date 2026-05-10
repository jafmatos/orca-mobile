import React from "react";
import { View } from "react-native";
import { Portal } from "@gorhom/portal";
import { useTheme } from "react-native-paper";
import { BottomSheet, BottomSheetProps, BottomSheetRef } from "jam-bottomsheet";
import { useStackedBackHandler } from "@/hooks/use-stacked-back-handler";

export interface AppBottomSheetProps extends BottomSheetProps {
  portalHostName?: string;
}

export const AppBottomSheet = React.forwardRef<BottomSheetRef, AppBottomSheetProps>(function AppBottomSheet(
  { portalHostName, ...bottomSheetProps }: AppBottomSheetProps,
  ref,
) {
  const theme = useTheme();

  return (
    <Portal hostName={portalHostName || "bottomsheet"}>
      <BottomSheet
        {...bottomSheetProps}
        ref={ref}
        backgroundColor={theme.colors.background}
        handleColor={theme.colors.onBackground}
        backdropColor={theme.colors.backdrop}
        backdropOpacity={1}
        style={{
          zIndex: 100,
        }}
      >
        <View className="p-4">{bottomSheetProps.children}</View>
      </BottomSheet>
    </Portal>
  );
});
