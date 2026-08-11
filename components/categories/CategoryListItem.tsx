import { useAppTheme } from "@/hooks/use-app-theme";
import { Category, CategoryTypes } from "@/models/Category";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { useState } from "react";
import { View } from "react-native";
import { Icon, IconButton, Menu, Text } from "react-native-paper";
import { AppHideableCurrencyText } from "../ui/AppHideableCurrencyText";
import { AppConditional } from "../utils/AppConditional";

interface CategoryListItemProps {
  data: Category;
  onPressEdit: (category: Category) => void;
  onPressDelete: (category: Category) => void;
}

export function CategoryListItem(props: CategoryListItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = useAppTheme();

  return (
    <View
      className={`relative py-1 pl-4 rounded-lg flex flex-row items-center justify-between gap-0 border-l-[6px]`}
      style={{
        borderRadius: theme.roundness,
        borderLeftColor: props.data.type === CategoryTypes.Income ? theme.colors.success : theme.colors.error,
      }}
    >
      <View className="grow flex" style={{ flexShrink: 1 }}>
        <Text style={{ flexShrink: 1 }} variant="titleMedium" ellipsizeMode="tail" numberOfLines={1}>
          {props.data.name}
        </Text>
      </View>

      <AppConditional
        if={!!props.data.limit}
        _then={
          <AppHideableCurrencyText className="ml-4" variant="bodySmall">
            {currencyFormatter.format(props.data.limit?.amount || 0)}
          </AppHideableCurrencyText>
        }
      />

      <Menu
        style={{ transform: [{ translateX: -7 }, { translateY: 56 }] }}
        anchor={<IconButton icon="dots-vertical" onPress={() => setIsMenuOpen(true)} />}
        anchorPosition="top"
        visible={isMenuOpen}
        onDismiss={() => setIsMenuOpen(false)}
      >
        <Menu.Item
          title="Editar"
          leadingIcon="pencil"
          onPress={() => {
            setIsMenuOpen(false);

            props.onPressEdit(props.data);
          }}
        />
        <Menu.Item
          title="Remover"
          leadingIcon={({ size }) => {
            return <Icon source="trash-can" size={size} color={theme.colors.error} />;
          }}
          titleStyle={{ color: theme.colors.error }}
          onPress={() => {
            setIsMenuOpen(false);

            props.onPressDelete(props.data);
          }}
        />
      </Menu>
    </View>
  );
}
