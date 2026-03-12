import { PropsWithChildren } from "react";
import Toast, { BaseToast, ToastConfigParams } from "react-native-toast-message";
import { KeyboardAvoidingComponent } from "../KeyboardAvoindingComponent";
import { ThemedComponent } from "../ThemedComponent";
import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { MaterialIcons as MaterialIcon } from "@expo/vector-icons";
import { View } from "react-native";

export function GlobalLayout(props: PropsWithChildren) {
  const appThemeColors = useAppThemeColors();

  const makeToast = (color: string, icon?: React.ReactNode) => {
    // eslint-disable-next-line react/display-name
    return (props: ToastConfigParams<any>) => {
      return (
        <BaseToast
          {...props}
          style={{
            borderLeftColor: color,
            backgroundColor: appThemeColors["--color-background-900"],
            height: "auto",
            paddingVertical: 10,
          }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          text1Style={{
            fontSize: 16,
            fontWeight: "600",
            color: appThemeColors["--color-typography-0"],
          }}
          text2Style={{
            fontSize: 14,
            fontWeight: "400",
            color: appThemeColors["--color-typography-200"],
          }}
          renderTrailingIcon={() => {
            return <View className="mx-4 flex items-center justify-center">{icon}</View>;
          }}
          text2NumberOfLines={3}
        />
      );
    };
  };

  return (
    <ThemedComponent>
      <KeyboardAvoidingComponent>{props.children}</KeyboardAvoidingComponent>
      <Toast
        autoHide
        position="top"
        swipeable
        visibilityTime={5000}
        config={{
          success: makeToast(
            appThemeColors["--color-success-500"],
            <MaterialIcon size={20} color={appThemeColors["--color-success-500"]} name="check-circle-outline" />,
          ),
          warning: makeToast(
            appThemeColors["--color-warning-500"],
            <MaterialIcon size={20} color={appThemeColors["--color-warning-500"]} name="warning-amber" />,
          ),
          error: makeToast(
            appThemeColors["--color-danger-500"],
            <MaterialIcon size={20} color={appThemeColors["--color-danger-500"]} name="error-outline" />,
          ),
        }}
      />
    </ThemedComponent>
  );
}
