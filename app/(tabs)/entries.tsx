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
            <ButtonText>Button that does nothing</ButtonText>
          </Button>
          <Text>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas iste provident alias numquam quasi soluta, sapiente at eius
            expedita quia, dolores hic maiores adipisci? Provident qui voluptate, debitis officia obcaecati aut aliquam earum iure itaque
            dolor pariatur cum suscipit blanditiis enim corrupti esse explicabo porro est iusto error! Ullam, aliquam voluptas laudantium
            expedita consequatur harum. Ea placeat optio mollitia natus tenetur, nesciunt dolorem harum temporibus voluptas? Nesciunt
            suscipit nemo molestiae incidunt. Ab saepe perferendis iusto laborum ipsa error alias, quod dolorem! Odio nostrum id vero,
            temporibus sed debitis in animi laborum, deserunt harum laboriosam ea vel porro eveniet labore quisquam at veritatis expedita.
            Asperiores ipsa possimus, deleniti hic velit rerum libero sed aliquid maiores aperiam ipsum fuga cum itaque provident omnis
            dicta officia recusandae beatae eligendi voluptas commodi minus. Possimus fuga ullam accusantium veritatis labore libero beatae
            itaque? Labore totam ab pariatur eveniet quisquam rerum voluptate neque nostrum accusantium, deserunt nulla cumque nemo aliquid
            assumenda illum quaerat sit impedit omnis voluptatibus, laborum blanditiis. Sapiente asperiores fuga, dicta, accusantium
            perferendis, nostrum at pariatur molestias ullam est eum commodi recusandae debitis velit praesentium. Harum enim sint voluptate
            at obcaecati eaque molestias quaerat cum! Quibusdam beatae voluptates consectetur. Magni, aspernatur assumenda possimus quasi
            debitis distinctio nulla ipsam molestias dolorem provident atque cum delectus asperiores. Neque, sit ad deserunt delectus
            nostrum mollitia debitis vitae? Quod optio corporis molestias maxime cupiditate accusamus nihil perferendis consectetur
            suscipit, nulla culpa harum cum ducimus! Molestias, ipsum quidem. Impedit doloribus incidunt ipsum cumque ullam suscipit
            necessitatibus recusandae corporis et aliquid molestiae odit obcaecati laudantium deleniti ipsa eos hic, accusamus quae.
            Reiciendis magnam voluptates cumque temporibus possimus numquam cupiditate provident, eos quis, iure expedita a velit inventore
            nisi veritatis quo sed id suscipit enim explicabo ex accusamus. Ducimus voluptate dolore suscipit fuga laborum praesentium et
            unde assumenda delectus, ipsa enim quaerat ratione iste repellendus error odit similique est, vitae, dolor non id tenetur
            voluptas vel sunt. Nihil dolorum officiis harum esse fugit animi recusandae impedit veniam voluptatum quas nulla itaque at vel,
            sint corporis quod possimus illo autem temporibus perspiciatis sed. Mollitia nobis atque velit minus iure consectetur ad omnis
            fugit quasi magni. Praesentium consectetur ipsam repudiandae quae vel facere vero pariatur? Ullam nihil aspernatur, maiores
            culpa possimus aliquid ipsum deleniti et omnis magnam iste temporibus commodi. Ad, architecto. Velit, iste ipsum ipsam nobis
            doloremque illum ex placeat tempore odio necessitatibus! Rerum sed enim, quam, voluptatem reiciendis exercitationem eos
            praesentium dignissimos tempore placeat cupiditate velit? Laborum modi nihil incidunt consectetur. Pariatur velit fugiat esse
            inventore necessitatibus dolorem atque quam tempore animi commodi harum blanditiis placeat officia odio, est modi, sed quasi
            ducimus dolore ab libero quisquam cum! Pariatur perferendis asperiores expedita iste quod, laudantium tenetur repellendus
            accusamus iure? Explicabo illum quaerat, repellat dolor aliquam ab fugiat corporis sed quos ipsum possimus nihil laborum
            voluptas! Fugiat fuga laudantium sit quo nam molestiae at qui, libero sunt, adipisci explicabo quibusdam aliquam, enim delectus
            voluptatibus fugit. Reprehenderit voluptatibus mollitia eos dolores neque eius nobis perspiciatis alias harum magni! Esse, fugit
            aliquid? Ullam, dolore!
          </Text>
        </AppBottomSheet>
      </Portal>
    </TabbedLayout>
  );
}
