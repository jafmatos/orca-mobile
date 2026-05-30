import { useAppTheme } from "@/hooks/use-app-theme";
import { Text } from "react-native-paper";
import { View } from "react-native";

function AppChartContainerTitle(props: React.ComponentProps<typeof Text>) {
  return (
    <Text variant="titleMedium" {...props}>
      {props.children}
    </Text>
  );
}

function AppChartContainerContent(props: React.ComponentProps<typeof View>) {
  return <View className={`w-full flex flex-col items-center gap-8 ${props.className}`}>{props.children}</View>;
}

export function AppChartContainer(props: React.ComponentProps<typeof View>) {
  const theme = useAppTheme();

  return (
    <View
      {...props}
      className={`flex flex-col items-center ${props.className}`}
      style={[
        {
          borderRadius: theme.roundness,
        },
        props.style,
      ]}
    >
      {props.children}
    </View>
  );
}

AppChartContainer.Title = AppChartContainerTitle;
AppChartContainer.Content = AppChartContainerContent;
