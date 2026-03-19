import { Pressable, Text, View } from "@gluestack-ui/themed";

interface SubNavigationItemProps extends React.ComponentProps<typeof Pressable> {
  isActive: boolean;
  label: string;
}

function SubNavigationItem({ isActive, label, ...props }: SubNavigationItemProps) {
  return (
    <Pressable {...props} className={`relative h-full grow bg-background-950 ${props.className}`}>
      <View opacity={!isActive ? 0.5 : 1} className="h-full flex flex-row justify-center items-center">
        {isActive && <View className="absolute bottom-0 w-full h-1 bg-primary-500" />}
        <Text className="text-center" fontWeight={500}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export function SubNavigation(props: React.ComponentProps<typeof View>) {
  return <View {...props} className={`h-16 flex flex-row columns-2 border-b-[1px] border-outline-900 ${props.className}`} />;
}

SubNavigation.Item = SubNavigationItem;
