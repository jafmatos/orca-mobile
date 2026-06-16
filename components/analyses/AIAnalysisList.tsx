import { AIAnalysis } from "@/models/AIAnalysis";
import { useAIAnalyses } from "@/hooks/queries/use-ai-analyses";
import { FlatList, ListRenderItem, View } from "react-native";
import { EndOfListWithLoading } from "../EndOfListWithLoading";
import { useMemo } from "react";
import { PaginatedData } from "@/models/PaginatedData";

export interface AIAnalysisListProps extends Partial<React.ComponentProps<typeof FlatList<AIAnalysis>>> {
  renderItem: ListRenderItem<AIAnalysis>;
  onFetchSuccess?: (data?: PaginatedData<AIAnalysis>) => void;
}

export function AIAnalysisList(props: AIAnalysisListProps) {
  const analysesQuery = useAIAnalyses({
    onSuccess: props.onFetchSuccess,
  });

  const analyses = useMemo(() => analysesQuery.data?.pages.flatMap((page) => page.data) || [], [analysesQuery.data]);

  return (
    <FlatList
      style={{ flex: 1 }}
      contentContainerClassName="p-4 pb-32"
      ItemSeparatorComponent={() => <View className="h-4" />}
      data={analyses}
      renderItem={props.renderItem}
      ListHeaderComponent={props.ListHeaderComponent}
      ListFooterComponent={
        <EndOfListWithLoading
          isLoading={analysesQuery.isPending || analysesQuery.isFetchingNextPage}
          isOnEnd={!analysesQuery.isPending && !analysesQuery.isFetchingNextPage && !analysesQuery.hasNextPage}
          isEmpty={!analysesQuery.isPending && !analysesQuery.isFetching && analyses?.length === 0}
          endOfListText="Não há mais análises."
          emptyListText="O Antônio ainda não analisou suas finanças. Que tal consultar ele agora?"
        />
      }
      onEndReached={() => analysesQuery.fetchNextPage()}
      onEndReachedThreshold={1}
    />
  );
}
