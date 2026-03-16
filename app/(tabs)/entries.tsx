import { EntryCard } from "@/components/EntryCard";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { SearchField } from "@/components/ui/SearchField";
import { useEntries } from "@/hooks/queries/use-entries";
import { Entry } from "@/models/Entry";
import { Button, ButtonIcon, Spinner, Text } from "@gluestack-ui/themed";
import { View } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { FlatList } from "react-native";
import { SlidersHorizontalIcon, DownloadIcon } from "lucide-react-native";
import { EndOfListWithLoading } from "@/components/EndOfListWithLoading";

export default function EntriesScreen() {
  const router = useRouter();
  const { data, isPending, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useEntries();

  const entries: Entry[] = data?.pages.map((page) => page.data).flat() || [];

  return (
    <TabbedLayout>
      <Navigation />
      <FlatList
        ListHeaderComponent={() => {
          return (
            <View className="flex flex-row gap-4 mb-4">
              <SearchField
                onSearch={(text) => console.log(text)}
                containerProps={{
									height: "100%",
                  className: "grow",
                }}
              />
              <Button className="aspect-square" variant="outline">
                <ButtonIcon color="$primary500" as={SlidersHorizontalIcon} />
              </Button>
              <Button className="aspect-square" variant="outline">
                <ButtonIcon color="$primary500" as={DownloadIcon} />
              </Button>
            </View>
          );
        }}
        ListFooterComponent={
          <EndOfListWithLoading
            isLoading={isPending || isFetchingNextPage}
            endOfList={!isPending && !isFetchingNextPage && !hasNextPage}
            endOfListText="Não há mais lançamentos"
          />
        }
        contentContainerClassName="p-4"
        data={entries}
        renderItem={({ item }) => <EntryCard entry={item} />}
        ItemSeparatorComponent={() => <View className="h-4" />}
        onEndReached={() => fetchNextPage()}
        onEndReachedThreshold={1}
      />
    </TabbedLayout>
  );
}
