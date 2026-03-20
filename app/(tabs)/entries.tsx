import { EntryCard } from "@/components/EntryCard";
import { SearchField } from "@/components/ui/SearchField";
import { useEntries } from "@/hooks/queries/use-entries";
import { Entry } from "@/models/Entry";
import { Button, ButtonIcon, Text, View } from "@gluestack-ui/themed";
import { FlatList } from "react-native";
import { SlidersHorizontalIcon, DownloadIcon } from "lucide-react-native";
import { EndOfListWithLoading } from "@/components/EndOfListWithLoading";
import { useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { Portal } from "@gorhom/portal";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { AppFormField } from "@/components/AppFormField";

export default function EntriesScreen() {
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useEntries();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [text, setText] = useState("");

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
      <Portal hostName="bottomsheet">
        <AppBottomSheet ref={bottomSheetRef}>
          <AppFormField.TextInput value={text} placeholder="Testar KBAV" onChangeText={setText} />
        </AppBottomSheet>
      </Portal>
    </TabbedLayout>
  );
}
