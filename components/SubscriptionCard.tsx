import { useAppTheme } from "@/hooks/use-app-theme";
import { View } from "react-native";
import { Button, Icon, Surface, Text } from "react-native-paper";

interface SubscriptionCardHeaderProps {
  title: string;
}

export interface SubscriptionCardProps extends React.ComponentProps<typeof View> {}

// function SubscriptionCardTitle({ title }: SubscriptionCardHeaderProps) {
//   const theme = useAppTheme();

//   return (
//     <View className="flex flex-row justify-between items-center">
//       <View className="flex flex-row items-center gap-2">
//         <Icon source="crown" size={24} color={theme.colors.onPrimary} />

//         <Text variant="titleMedium" style={{ fontWeight: "bold", color: theme.colors.onPrimary }}>
//           {title}
//         </Text>
//       </View>
//     </View>
//   );
// }

function SubscriptionCardHeader({ title }: SubscriptionCardHeaderProps) {
  const theme = useAppTheme();

  return (
    <View className="flex flex-row justify-between items-center">
      <View className="flex flex-row items-center gap-2">
        <Icon source="crown" size={24} color={theme.colors.onPrimary} />

        <Text variant="titleMedium" style={{ fontWeight: "bold", color: theme.colors.onPrimary }}>
          {title}
        </Text>
      </View>
    </View>
  );
}

function SubscriptionCardContent(props: React.ComponentProps<typeof View>) {
  return <View {...props} />;
}

function SubscriptionCardAction(props: React.ComponentProps<typeof Button>) {
  const theme = useAppTheme();

  return (
    <Button
      mode="contained"
      buttonColor={theme.colors.onPrimary}
      textColor={theme.colors.primary}
      className="mt-2"
      style={{ borderRadius: theme.roundness }}
      {...props}
    />
  );
}

export function SubscriptionCard(props: SubscriptionCardProps) {
  const theme = useAppTheme();

  return (
    <Surface style={{ borderRadius: theme.roundness, overflow: "hidden", backgroundColor: theme.colors.primary }} className="!p-0">
      <View className="p-5 flex flex-col gap-3" {...props} />
    </Surface>
  );
}

SubscriptionCard.Header = SubscriptionCardHeader;
SubscriptionCard.Content = SubscriptionCardContent;
SubscriptionCard.Action = SubscriptionCardAction;
