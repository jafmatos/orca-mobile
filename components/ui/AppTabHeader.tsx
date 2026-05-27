import { useAppTheme } from "@/hooks/use-app-theme";
import { View } from "react-native";

export function AppTabHeader(props: React.ComponentProps<typeof View>) {
  const theme = useAppTheme();

  return (
    <View
      {...props}
      className={`p-4 w-full flex flex-row items-center justify-between ${props.className}`}
      style={[
        {
          backgroundColor: theme.colors.background,
          boxShadow: `0 1px 1px -1px ${theme.colors.outlineVariant}`,
          zIndex: 1,
        },
        props.style,
      ]}
    >
      {props.children}
    </View>
  );
}
