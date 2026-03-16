import { Text, Spinner } from "@gluestack-ui/themed";
import { View } from "react-native";

export type EndOfListWithLoadingProps = {
  isLoading?: boolean;
  endOfList?: boolean;
  endOfListText: string;
};

export function EndOfListWithLoading(props: EndOfListWithLoadingProps) {
  const content = props.endOfList ? (
    <Text color="$typography400" size="sm">
      {props.endOfListText}
    </Text>
  ) : props.isLoading ? (
    <Spinner className="mt-4" size={40} />
  ) : (
    <></>
  );

  return <View className="p-4 h-[160px] flex flex-row justify-center items-start">{content}</View>;
}
