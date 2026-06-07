import { CategoryTypes } from "@/models/Category";
import React from "react";
import { View } from "react-native";
import { useAppTheme } from "@/hooks/use-app-theme";
import { AppTextSwitch } from "../ui/AppTextSwitch";

export interface CategoryFilter {
  type?: CategoryTypes;
}

export interface CategoryListHeaderProps extends React.ComponentProps<typeof View> {
  onFilterChange: (filter: CategoryFilter) => void;
}

export function CategoryListHeader(props: CategoryListHeaderProps) {
  const theme = useAppTheme();
  const [selectedType, setSelectedType] = React.useState<CategoryTypes | undefined>();

  const handleTypeChange = (type: CategoryTypes | undefined) => {
    setSelectedType(type);
    props.onFilterChange({ type });
  };

  return (
      <AppTextSwitch<CategoryTypes>
				unselectOnRepress
        value={selectedType as CategoryTypes}
        onChange={handleTypeChange}
        options={[
          { value: CategoryTypes.Expense, label: "Despesa" },
          { value: CategoryTypes.Income, label: "Receita" },
        ]}
        style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
        activeBackgroundColor={theme.colors.primaryContainer}
        activeTextColor={theme.colors.onPrimaryContainer}
        inactiveTextColor={theme.colors.onPrimary}
      />
  );
}
