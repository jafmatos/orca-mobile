import { EndOfListWithLoading } from "@/components/EndOfListWithLoading";
import { EntryCard } from "@/components/EntryCard";
import { EntryDetailBottomSheet } from "@/components/EntryDetailBottomSheet";
import { EntryFormFullScreenOverlay } from "@/components/EntryFormFullScreenOverlay";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { SearchField } from "@/components/ui/SearchField";
import { useEntries } from "@/hooks/queries/use-entries";
import { Entry } from "@/models/Entry";
import { Button, ButtonIcon, Fab, FabIcon, FabLabel, View } from "@gluestack-ui/themed";
import { DownloadIcon, PlusIcon, SlidersHorizontalIcon } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Pressable } from "react-native";

export default function EntriesScreen() {
  const [selectedEntry, setSelectedEntry] = useState<Entry | undefined>();
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useEntries();

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
                <Button className="aspect-square" variant="outline">
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
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => {
                setSelectedEntry(item);
              }}
            >
              <EntryCard entry={item} />
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        onEndReached={() => fetchNextPage()}
        onEndReachedThreshold={1}
      />
      <EntryFormFullScreenOverlay
        update={selectedEntry}
        trigger={({ open }) => {
          return (
            <Fab size="sm" placement="bottom right" onPress={open}>
              <FabIcon mr="$1" as={PlusIcon} color="$onPrimary" />
              <FabLabel fontWeight={500} color="$onPrimary">
                Novo lançamento
              </FabLabel>
            </Fab>
          );
        }}
      />
      <EntryDetailBottomSheet isOpen={!!selectedEntry} close={() => setSelectedEntry(undefined)} entry={selectedEntry} />
    </TabbedLayout>
  );
}
