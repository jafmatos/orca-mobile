import Toast, { BaseToast, ToastConfigParams } from "react-native-toast-message";
import { View } from "react-native";
import { Icon } from "react-native-paper";
import { useAppTheme } from "@/hooks/use-app-theme";

export function AppToast(props: React.ComponentProps<typeof Toast>) {
  const theme = useAppTheme();

  const makeToast = (color: string, icon?: React.ReactNode) => {
    // eslint-disable-next-line react/display-name
    return (props: ToastConfigParams<any>) => {
      return (
        <BaseToast
          {...props}
          style={{
            borderLeftColor: color,
            backgroundColor: theme.colors.surface,
            height: "auto",
            paddingVertical: 10,
          }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          text1Style={{
            fontSize: 16,
            fontWeight: "600",
            color: theme.colors.onSurface,
          }}
          text2Style={{
            fontSize: 14,
            fontWeight: "400",
            color: theme.colors.onSurfaceVariant,
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
    <Toast
      {...props}
      autoHide
      position="top"
      swipeable
      visibilityTime={5000}
      config={{
        success: makeToast(theme.colors.success, <Icon source="check-circle" size={20} color={theme.colors.success} />),
        warning: makeToast(theme.colors.warning, <Icon source="alert-circle" size={20} color={theme.colors.warning} />),
        error: makeToast(theme.colors.error, <Icon source="close-circle" size={20} color={theme.colors.error} />),
      }}
    />
  );
}
