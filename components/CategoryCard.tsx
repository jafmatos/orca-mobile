import { Box, Button, ButtonIcon, Menu, MenuItem, MenuItemLabel, Text } from "@gluestack-ui/themed";
import { Category, CategoryTypes } from "@/models/Category";
import { TouchableOpacity } from "react-native";
import { MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react-native";
import useAppThemeColors from "@/hooks/use-app-theme-colors";

export type CategoryCardProps = {
  category: Category;
};

export function CategoryCard(props: CategoryCardProps) {
  const themeColors = useAppThemeColors();
  return (
    <Box
      className={`pl-4 py-2 rounded-lg flex flex-row items-center justify-between gap-4 border-l-[6px] ${props.category.type === CategoryTypes.Income ? "border-l-success-500" : "border-l-danger-500"}`}
      backgroundColor="$background800"
    >
      <Text className="grow" ellipsizeMode="tail" numberOfLines={1}>
        {props.category.name}
      </Text>
      <Menu
        placement={"bottom end" as any}
        offset={3}
        trigger={({ ...triggerProps }) => {
          return (
            <Button className="aspect-square !bg-transparent" {...triggerProps}>
              <ButtonIcon as={() => <MoreVerticalIcon size={22} color={themeColors["--color-typography-0"]} />} />
            </Button>
          );
        }}
      >
        <MenuItem key="Editar" textValue="Editar" className="flex flex-row gap-3">
          <PencilIcon className="mr-2" color={themeColors["--color-typography-0"]} />
          <MenuItemLabel size="sm" fontWeight={500}>
            Editar
          </MenuItemLabel>
        </MenuItem>
        <MenuItem key="Remover" textValue="Remover" className="flex flex-row gap-3">
          <TrashIcon className="mr-2" color={themeColors["--color-danger-500"]} />
          <MenuItemLabel size="sm" fontWeight={500}>
            Remover
          </MenuItemLabel>
        </MenuItem>
      </Menu>
    </Box>
  );
}
