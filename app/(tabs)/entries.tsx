import { EntryCard } from "@/components/EntryCard";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { SearchField } from "@/components/ui/SearchField";
import { useEntries } from "@/hooks/queries/use-entries";
import { Entry } from "@/models/Entry";
import { Button, ButtonIcon, Text, View } from "@gluestack-ui/themed";
import { FlatList } from "react-native";
import { SlidersHorizontalIcon, DownloadIcon } from "lucide-react-native";
import { EndOfListWithLoading } from "@/components/EndOfListWithLoading";
import { useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";

export default function EntriesScreen() {
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useEntries();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const entries: Entry[] = data?.pages.map((page) => page.data).flat() || [];

  return (
    <TabbedLayout>
      <FlatList
        ListHeaderComponent={() => {
          return (
            <View className="flex flex-col gap-4">
              <View className="flex flex-row gap-4 mb-4">
                <SearchField
                  onSearch={(text) => console.log(text)}
                  containerProps={{
                    height: "100%",
                    className: "grow",
                  }}
                />
                <Button className="aspect-square" variant="outline" onPress={() => bottomSheetRef.current?.expand()}>
                  <ButtonIcon color="$primary500" as={SlidersHorizontalIcon} />
                </Button>
                <Button className="aspect-square" variant="outline">
                  <ButtonIcon color="$primary500" as={DownloadIcon} />
                </Button>
              </View>
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
      <AppBottomSheet ref={bottomSheetRef}>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt possimus nulla quidem iure quas unde iusto, pariatur, aliquid
          vel amet repellendus! Consequatur excepturi dicta veniam temporibus dolores officiis minima dolorem odio voluptatum sint, odit,
          dolor alias voluptatem repellat quo perferendis magnam fugiat. Id sit ipsam recusandae quas quidem atque laborum?
        </Text>
      </AppBottomSheet>
    </TabbedLayout>
  );
}
