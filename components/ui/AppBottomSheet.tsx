import useAppThemeColors from "@/hooks/use-app-theme-colors";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";

export interface AppBottomSheetProps extends React.ComponentProps<typeof BottomSheetView> {
  containerProps?: Omit<React.ComponentProps<typeof BottomSheet>, "children">;
}

// eslint-disable-next-line react/display-name
export const AppBottomSheet = forwardRef<BottomSheet, AppBottomSheetProps>(({ containerProps, ...props }, ref) => {
  const themeColors = useAppThemeColors();

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
    ),
    [],
  );

  return (
    <BottomSheet
      {...containerProps}
      ref={ref}
      index={-1}
      backdropComponent={renderBackdrop}
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
      <BottomSheetView {...props} className="p-4 min-h-[240px] bg-background-950" />
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
