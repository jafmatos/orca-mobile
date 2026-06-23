import { useAnalyses } from "@/hooks/queries/use-ai-analyses";
import { Analysis } from "@/models/Analysis";
import { PaginatedData } from "@/models/PaginatedData";
import { useMemo } from "react";
import { FlatList, ListRenderItem, View } from "react-native";
import { EndOfListWithLoading } from "../EndOfListWithLoading";
import { AppKeyboardDismissing } from "../ui/AppKeyboardDismissing";

export interface AnalysisListProps extends Partial<React.ComponentProps<typeof FlatList<Analysis>>> {
  renderItem: ListRenderItem<Analysis>;
  onFetchSuccess?: (data?: PaginatedData<Analysis>) => void;
}

export function AnalysisList(props: AnalysisListProps) {
  const analysesQuery = useAnalyses({
    onSuccess: props.onFetchSuccess,
  });

  const analyses = useMemo(() => analysesQuery.data?.pages.flatMap((page) => page.data) || [], [analysesQuery.data]);

  return (
    <AppKeyboardDismissing.FlatList
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
