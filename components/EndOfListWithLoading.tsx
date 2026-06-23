import { View } from "react-native";
import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper";

export type EndOfListWithLoadingProps = {
  isLoading?: boolean;
  isEmpty?: boolean;
  isOnEnd?: boolean;
  endOfListText: string;
  emptyListText: string;
};

const EndOfListWithLoadingContainer = (props: React.ComponentProps<typeof View>) => {
  return <View {...props} className={`h-[160px] flex flex-row justify-center items-start pt-8 ${props.className ?? ""}`} />;
};

export function EndOfListWithLoading(props: EndOfListWithLoadingProps) {
  if (props.isLoading) {
    return (
      <EndOfListWithLoadingContainer>
        <ActivityIndicator />
      </EndOfListWithLoadingContainer>
    );
  }

  if (props.isEmpty) {
    return (
      <EndOfListWithLoadingContainer>
        <Text variant="bodyMedium" className="!text-center">
          {props.emptyListText}
        </Text>
      </EndOfListWithLoadingContainer>
    );
  }

  if (props.isOnEnd) {
    return (
      <EndOfListWithLoadingContainer>
        <Text variant="bodyMedium" className="!text-center">
          {props.endOfListText}
        </Text>
      </EndOfListWithLoadingContainer>
    );
  }

  return <EndOfListWithLoadingContainer></EndOfListWithLoadingContainer>;
}
