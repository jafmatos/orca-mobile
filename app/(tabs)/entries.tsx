import { AppFormField } from "@/components/AppFormField";
import { EndOfListWithLoading } from "@/components/EndOfListWithLoading";
import { EntryCard } from "@/components/EntryCard";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { AppSelect } from "@/components/ui/AppSelect";
import { SearchField } from "@/components/ui/SearchField";
import { useCategories } from "@/hooks/queries/use-categories";
import { useEntries } from "@/hooks/queries/use-entries";
import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { Entry } from "@/models/Entry";
import { Button, ButtonIcon, ButtonText, Fab, FabIcon, FabLabel, View } from "@gluestack-ui/themed";
import { Portal } from "@gorhom/portal";
import { DownloadIcon, PlusIcon, SlidersHorizontalIcon } from "lucide-react-native";
import { useState } from "react";
import { FlatList } from "react-native";

export default function EntriesScreen() {
  const themeColors = useAppThemeColors();
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useEntries();
  const { data: categories } = useCategories();
  const [isFilterBottomSheetOpen, setIsFilterBottomSheetOpen] = useState(false);
  const [isFormBottomSheetOpen, setIsFormBottomSheetOpen] = useState(false);
  const [isSelectCategoryBottomSheetOpen, setIsSelectCategoryBottomSheetOpen] = useState(false);

  const closeFilterBottomSheet = () => setIsFilterBottomSheetOpen(false);

  const openFilterBottomSheet = () => setIsFilterBottomSheetOpen(true);

  const closeFormBottomSheet = () => setIsFormBottomSheetOpen(false);

  const openFormBottomSheet = () => setIsFormBottomSheetOpen(true);

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
      <Fab size="sm" placement="bottom right" onPress={openFormBottomSheet}>
        <FabIcon mr="$1" as={PlusIcon} color="$onPrimary" />
        <FabLabel fontWeight={500} color="$onPrimary">
          Novo lançamento
        </FabLabel>
      </Fab>
      <Portal hostName="bottomsheet">
        <AppBottomSheet expandable isOpen={isFilterBottomSheetOpen} onClose={closeFilterBottomSheet}>
          <AppFormField.TextInput value={text} placeholder="Testar KBAV" onChangeText={setText} />
          <Button>
            <ButtonText>Button that does nothing</ButtonText>
          </Button>
        </AppBottomSheet>
        <AppBottomSheet expandable isOpen={isFormBottomSheetOpen} onClose={closeFormBottomSheet}>
          
        </AppBottomSheet>
      </Portal>
    </TabbedLayout>
  );
}
