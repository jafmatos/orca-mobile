import { useAppTheme } from "@/hooks/use-app-theme";
import { Divider, Surface, Text } from "react-native-paper";
import { Conditional } from "../utils/Conditional";
import { View } from "react-native";

export interface AppChartContainerProps extends React.ComponentProps<typeof Surface> {
  HeaderComponent?: React.JSX.Element;
}

function AppChartContainerHeader(props: React.ComponentProps<typeof View>) {
  const theme = useAppTheme();

  return (
    <View
      {...props}
      className={`p-4 w-full flex flex-row items-center justify-between ${props.className}`}
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

function AppChartContainerTitle(props: React.ComponentProps<typeof Text>) {
  return (
    <Text variant="titleMedium" {...props}>
      {props.children}
    </Text>
  );
}

function AppChartContainerContent(props: React.ComponentProps<typeof View>) {
  return <View className={`p-8 w-full flex flex-col items-center gap-8 ${props.className}`}>{props.children}</View>;
}

export function AppChartContainer(props: AppChartContainerProps) {
  const theme = useAppTheme();

  return (
    <Surface
      {...props}
      className={`flex flex-col items-center ${props.className}`}
      style={[
        {
          borderRadius: theme.roundness,
        },
        props.style,
      ]}
    >
      <Conditional
        if={!!props.HeaderComponent}
        _then={
          <>
            {props.HeaderComponent}

            <Divider className="w-full" horizontalInset style={{ backgroundColor: theme.colors.outlineVariant }} />
          </>
        }
      />
      {props.children}
    </Surface>
  );
}

AppChartContainer.Header = AppChartContainerHeader;
AppChartContainer.Title = AppChartContainerTitle;
AppChartContainer.Content = AppChartContainerContent;
