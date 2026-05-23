import { Portal } from "@gorhom/portal";
import React, { useImperativeHandle, useRef, useState } from "react";
import { useTheme } from "react-native-paper";
import { BottomSheet, BottomSheetControlledProps, BottomSheetImperativeProps, BottomSheetRef } from "jam-bottomsheet";
import { View } from "react-native";
import { useBackHandlerQueue } from "@/hooks/use-back-handler-queue";

export interface AppBottomSheetComplementaryProps {
  portalHostName?: string;
}

export type AppBottomSheetRef = BottomSheetRef;

export type AppBottomSheetProps = (BottomSheetControlledProps | BottomSheetImperativeProps) & AppBottomSheetComplementaryProps;

export const AppBottomSheet = React.forwardRef<AppBottomSheetRef, AppBottomSheetProps>(function AppBottomSheet(
  { portalHostName, children, ...bottomSheetProps }: AppBottomSheetProps,
  ref,
) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(!!bottomSheetProps.isOpen);
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  useImperativeHandle(ref, () => {
    return {
      open: (...args: Parameters<BottomSheetRef["open"]>) => bottomSheetRef.current?.open(...args),
      close: (...args: Parameters<BottomSheetRef["close"]>) => bottomSheetRef.current?.close(...args),
    };
  });

  useBackHandlerQueue({
    isOpen,
    close: () => bottomSheetRef.current?.close(),
  });

  return (
    <Portal hostName={portalHostName || "bottomsheet"}>
      <BottomSheet
        {...bottomSheetProps}
        ref={bottomSheetRef}
        backgroundColor={theme.colors.background}
        handleColor={theme.colors.onBackground}
        backdropColor={theme.colors.backdrop}
        backdropOpacity={1}
        style={[
          {
            zIndex: 100,
          },
          bottomSheetProps.style,
        ]}
        onOpenAnimationStarted={() => {
          setIsOpen(true);

          bottomSheetProps.onOpenAnimationFinished?.();
        }}
        onCloseAnimationStarted={() => {
          setIsOpen(false);

          bottomSheetProps.onCloseAnimationStarted?.();
        }}
      >
        <View className="p-4">{children}</View>
      </BottomSheet>
    </Portal>
  );
});
