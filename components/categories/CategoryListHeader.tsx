import { useAppTheme } from "@/hooks/use-app-theme";
import { CategoryTypes } from "@/models/Category";
import React from "react";
import { Pressable, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import { Conditional } from "../utils/Conditional";

export interface CategoryFilter {
  type?: CategoryTypes;
}

export interface CategoryListHeaderProps extends React.ComponentProps<typeof View> {
  onFilterChange: (filter: CategoryFilter) => void;
}

export function CategoryListHeader(props: CategoryListHeaderProps) {
  const theme = useAppTheme();
  const [selectedType, setSelectedType] = React.useState<CategoryTypes>();

  const onTypePress = (type: CategoryTypes) => {
    const newType = selectedType === type ? undefined : type;

    setSelectedType(newType);
    props.onFilterChange({ type: newType });
  };

  return (
    <View {...props} className={`flex flex-row ${props.className || ""}`}>
      <Pressable onPress={() => onTypePress(CategoryTypes.Expense)} className="relative grow items-center justify-center h-16">
        <Conditional
          if={selectedType === CategoryTypes.Expense}
          _then={<View className="absolute h-1 w-full rounded-sm bottom-0" style={{ backgroundColor: theme.colors.primary }} />}
        />
        <Text variant="labelLarge">Despesa</Text>
      </Pressable>
      <Pressable onPress={() => onTypePress(CategoryTypes.Income)} className="relative grow items-center justify-center h-16">
        <Conditional
          if={selectedType === CategoryTypes.Income}
          _then={<View className="absolute h-1 w-full rounded-sm bottom-0" style={{ backgroundColor: theme.colors.primary }} />}
        />
        <Text variant="labelLarge">Receita</Text>
      </Pressable>
    </View>
  );
}
