import { useAppTheme } from "@/hooks/use-app-theme";
import { Pressable, View } from "react-native";
import { Text } from "react-native-paper";
import { Conditional } from "./utils/Conditional";

interface SubNavigationItemProps extends React.ComponentProps<typeof Pressable> {
  isActive: boolean;
  label: string;
}

function SubNavigationItem({ isActive, label, ...props }: SubNavigationItemProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      {...props}
      className={`relative h-full grow ${props.className}`}
      style={{
        backgroundColor: theme.colors.background,
      }}
    >
      <View className="h-full flex flex-row justify-center items-center">
        <Conditional
          if={isActive}
          _then={
            <View
              className="absolute bottom-0 w-full"
              style={{
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.colors.primary,
              }}
            />
          }
        />

        <Text variant="bodyMedium" className="text-center">
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export function SubNavigation(props: React.ComponentProps<typeof View>) {
  const theme = useAppTheme();

  return (
    <View
      {...props}
      className={`h-16 flex flex-row columns-2 ${props.className}`}
      style={{
        zIndex: 2,
        backgroundColor: theme.colors.background,
        boxShadow: `0 1px 1px -1px ${theme.colors.outlineVariant}`,
      }}
    />
  );
}

SubNavigation.Item = SubNavigationItem;
