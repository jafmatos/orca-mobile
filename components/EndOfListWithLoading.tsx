import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export type EndOfListWithLoadingProps = {
  isLoading?: boolean;
  endOfList?: boolean;
  endOfListText: string;
};

export function EndOfListWithLoading(props: EndOfListWithLoadingProps) {
  const content = props.endOfList ? (
    <Text variant="bodyMedium">{props.endOfListText}</Text>
  ) : props.isLoading ? (
    <ActivityIndicator className="mt-4" />
  ) : (
    <></>
  );

  return <View className="p-4 h-[160px] flex flex-row justify-center items-start">{content}</View>;
}
