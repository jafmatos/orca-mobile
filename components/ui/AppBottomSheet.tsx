import useAppThemeColors from "@/hooks/use-app-theme-colors";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo } from "react";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BottomSheetCustomBackdrop = ({ animatedIndex, style }: React.ComponentProps<typeof BottomSheetBackdrop>) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0, 1], [0, 1], "clamp"),
  }));

  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: "#000",
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle],
  );

  return <Animated.View style={containerStyle} />;
};

export interface AppBottomSheetProps extends React.ComponentProps<typeof BottomSheetView> {
  containerProps?: Omit<React.ComponentProps<typeof BottomSheet>, "children">;
}

// eslint-disable-next-line react/display-name
export const AppBottomSheet = forwardRef<BottomSheet, AppBottomSheetProps>(({ containerProps, ...props }, ref) => {
  const themeColors = useAppThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <BottomSheet
      {...containerProps}
      ref={ref}
      index={-1}
      // backdropComponent={BottomSheetCustomBackdrop}
      enablePanDownToClose 
      backgroundStyle={{
        backgroundColor: themeColors["--color-background-950"],
      }}
      handleIndicatorStyle={{
        backgroundColor: themeColors["--color-typography-0"],
      }}
      handleStyle={{
        backgroundColor: themeColors["--color-background-950"],
        borderRadius: 12,
      }}
    >
      <BottomSheetView {...props} style={{ paddingBottom: insets.bottom + 16 }} className="p-4 min-h-[240px] bg-background-950" />
    </BottomSheet>
  );
});

// export function AppBottomSheet({ containerProps, ...props }: AppBottomSheetProps) {
//   return (
//     <GestureHandlerRootView>
//       <BottomSheet {...containerProps}>
//         <BottomSheetView {...props} />
//       </BottomSheet>
//     </GestureHandlerRootView>
//   );
// }
