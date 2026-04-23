import { useAppTheme } from "@/hooks/use-app-theme";
import { Category, CategoryTypes } from "@/models/Category";
import { IconButton, Surface, Text } from "react-native-paper";

export type CategoryCardProps = {
  category: Category;
};

export function CategoryCard(props: CategoryCardProps) {
  const theme = useAppTheme();

  return (
    <Surface
      className={`pl-4 py-1 rounded-lg flex flex-row items-center justify-between gap-4 border-l-[6px]`}
      style={{
        borderRadius: theme.roundness,
        borderLeftColor: props.category.type === CategoryTypes.Income ? theme.colors.success : theme.colors.error,
      }}
    >
      <Text className="grow" ellipsizeMode="tail" numberOfLines={1}>
        {props.category.name}
      </Text>
      <IconButton icon="menu" />
      {/* <Menu
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
          <MenuItemLabel>
            Editar
          </MenuItemLabel>
        </MenuItem>
        <MenuItem key="Remover" textValue="Remover" className="flex flex-row gap-3">
          <TrashIcon className="mr-2" color={themeColors["--color-danger-500"]} />
          <MenuItemLabel>
            Remover
          </MenuItemLabel>
        </MenuItem>
      </Menu> */}
    </Surface>
  );
}
