import { CategoryTypes } from "@/models/Category";
import React from "react";
import { View } from "react-native";
import { AppSegmentedControl } from "../ui/AppSegmentedControl";

export interface CategoryFilter {
  type?: CategoryTypes;
}

export interface CategoryListHeaderProps extends React.ComponentProps<typeof View> {
  onFilterChange: (filter: CategoryFilter) => void;
}

export function CategoryListHeader(props: CategoryListHeaderProps) {
  const [selectedType, setSelectedType] = React.useState<CategoryTypes | undefined>();

  const handleTypeChange = (type: CategoryTypes | undefined) => {
    setSelectedType(type);
    props.onFilterChange({ type });
  };

  return (
    <AppSegmentedControl<CategoryTypes>
      {...props}
      options={[
        { label: "Despesa", value: CategoryTypes.Expense },
        { label: "Receita", value: CategoryTypes.Income },
      ]}
      value={selectedType}
      onChange={handleTypeChange}
      allowUnselect
      className={`h-16 ${props.className || ""}`}
    />
  );
}
