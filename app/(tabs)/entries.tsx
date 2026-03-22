import { EntryCard } from "@/components/EntryCard";
import { SearchField } from "@/components/ui/SearchField";
import { useEntries } from "@/hooks/queries/use-entries";
import { Entry } from "@/models/Entry";
import { Button, ButtonIcon, ButtonText, Text, View } from "@gluestack-ui/themed";
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
  const [isFilterBottomSheetOpen, setIsFilterBottomSheetOpen] = useState(false);
  const [text, setText] = useState("");

  const closeFilterBottomSheet = () => setIsFilterBottomSheetOpen(false);

  const openFilterBottomSheet = () => setIsFilterBottomSheetOpen(true);

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
                <Button className="aspect-square" variant="outline" onPress={openFilterBottomSheet}>
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
        <AppBottomSheet expandable isOpen={isFilterBottomSheetOpen} onClose={closeFilterBottomSheet}>
          <AppFormField.TextInput value={text} placeholder="Testar KBAV" onChangeText={setText} />
          <Button>
            <ButtonText>
							Button that does nothing
						</ButtonText>
          </Button>
					<Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem quasi autem fugit officiis ipsa rem quam doloremque neque animi ab amet laborum quisquam nulla perspiciatis, repellendus alias expedita minima. Reiciendis vel quis dolor ad animi nihil, nemo voluptates a pariatur atque nulla et impedit ipsum ut magni adipisci eligendi iste eum exercitationem laudantium error enim expedita? Magni accusamus ex adipisci tempora sed quibusdam culpa. Iusto voluptatem sequi minus ipsum repudiandae, fugit consequuntur cupiditate delectus enim, sed dolor illum modi vero necessitatibus mollitia expedita alias placeat optio aliquam nisi tempore facere hic pariatur. Alias consequatur neque impedit adipisci quos dolorem praesentium voluptates aspernatur sapiente est, possimus at excepturi ad maxime. Nemo ipsum cum eum minima eligendi. Id officiis accusantium, vel distinctio cupiditate quo atque perspiciatis perferendis suscipit! Facere labore quisquam obcaecati ipsum temporibus minima facilis aspernatur porro odit eius, non alias excepturi natus ad dolore! Soluta maiores vero a laborum ducimus in, velit earum quasi voluptatem. Dolor neque error cumque dolorem, magnam cum fugiat molestiae minima illo in cupiditate similique, vero dolore. Quasi voluptas, deleniti excepturi magni consequuntur itaque cum! Impedit, ut. Laboriosam non dolores illo voluptate inventore omnis qui ea eveniet! Tempora architecto facilis ipsum. In blanditiis quis illum sunt?</Text>
        </AppBottomSheet>
      </Portal>
    </TabbedLayout>
  );
}
