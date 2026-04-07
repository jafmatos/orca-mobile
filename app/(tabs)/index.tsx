import { AppFormField } from "@/components/AppFormField";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";
import { AppButton } from "@/components/ui/AppButton";
import { useState } from "react";
import { Text } from "react-native";

export default function HomeScreen() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  return (
    <TabbedLayout>
      <AppButton
        text="Sucesso"
        onPress={() => {
          setIsBottomSheetOpen(true);
        }}
      />

      <AppBottomSheet isOpen={isBottomSheetOpen} onClose={() => setIsBottomSheetOpen(false)} fullscreen>
        <AppFormField.TextInput />
        <AppButton text="Fechar" />
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio maiores eligendi distinctio. Tempora vel architecto quos magni,
          recusandae harum qui minus error eligendi porro molestias blanditiis. Mollitia totam delectus aliquam enim molestiae minus earum
          pariatur commodi saepe officia deserunt necessitatibus labore eaque, at ea aspernatur ratione eveniet veritatis, similique
          recusandae quod. Obcaecati, aperiam tempore rerum atque consectetur eaque ipsa. Numquam amet, cupiditate praesentium earum
          expedita, dolorem, dolor eveniet odit illum incidunt animi perspiciatis quisquam mollitia. Id commodi error dolores autem
          consectetur ipsa blanditiis iste odit in sint asperiores magni, omnis aliquid aperiam rerum? Beatae suscipit, quaerat sint iusto
          dolor id aut, praesentium vitae vel quam officiis aspernatur quas. Sapiente aliquam dicta voluptate nulla totam distinctio quam
          enim excepturi quo vero nobis unde, temporibus, cupiditate dolore vel hic cum. Dolorum repudiandae nisi earum explicabo deleniti
          officiis quasi doloribus soluta non architecto obcaecati tenetur cum deserunt atque ipsum saepe quisquam libero harum, ad
          consequatur? Repudiandae ea facere quaerat error? Odio quis doloribus debitis quo nesciunt nihil, repellendus ad a voluptatibus
          deleniti molestias velit commodi dolorum, reprehenderit veritatis nobis ipsum. Delectus dolorum quos ratione cumque architecto
          veritatis placeat libero, pariatur ex quis labore repudiandae qui fuga? Velit, iure fuga. Deserunt inventore, quis rem voluptatum
          possimus dicta. Corrupti numquam in quo magni alias velit nulla quasi hic dolor repudiandae deserunt, placeat dolorem id. Maiores,
          ipsa. Quod, sit maxime? Accusantium, et in consectetur aperiam vel maxime accusamus, sequi, asperiores repudiandae eum deleniti
          aut? Aut recusandae animi, vitae dignissimos sed dolores iste nemo ab facilis commodi excepturi tenetur, maiores quis officia iure
          asperiores voluptatem! Culpa nobis debitis voluptates non laudantium maiores, molestias quia voluptatibus assumenda. Placeat sint
          commodi libero quis odit alias quaerat voluptas expedita quas perferendis incidunt rerum ab porro quam labore esse, nam provident,
          nobis tempore, atque voluptate ducimus deleniti quae! Optio, tenetur veritatis facere nulla adipisci eum amet perspiciatis? Quos
          consequuntur vitae vero deserunt necessitatibus ab, nulla possimus ad modi voluptatem. Omnis dignissimos ipsam possimus animi
          repellendus, harum aut tempore sed sint, illum atque velit enim nisi. Delectus, eos iure? Deleniti, atque aliquam quasi veritatis
          consequuntur recusandae nam nesciunt eveniet cupiditate ut facere non aliquid? Quidem consequatur, repellendus facilis cum
          excepturi totam dolorum exercitationem deserunt! At animi eaque asperiores mollitia tempore, odit ab dicta? Maiores facere sed
          minus eos assumenda ducimus asperiores! Consequatur expedita maxime neque fugit dicta recusandae blanditiis rerum veniam numquam
          nesciunt. At cum laboriosam natus quos tenetur et ipsum, omnis ratione magnam. Aperiam dicta, corrupti expedita officia dolore,
          mollitia veritatis sit eveniet aliquid unde quaerat veniam pariatur. Repellendus magnam reprehenderit explicabo ipsam at deleniti
          ex voluptatum quae, cupiditate cum. Ducimus, minus. Amet ipsam maxime consectetur sit eos. Architecto molestiae molestias veniam
          velit? Totam ab rerum aliquid minima esse aperiam nostrum ipsum amet tenetur doloremque modi fugiat, accusantium inventore maxime
          ea, officiis consequuntur quae ad, at harum et. Ad nesciunt culpa eligendi illo quidem enim possimus error vel cupiditate
          pariatur, aliquid facilis maxime dolores debitis ut laborum hic aliquam et eos provident id maiores. Repudiandae provident tempora
          voluptatibus molestias minus sunt quaerat inventore, dolore adipisci expedita laudantium accusantium commodi praesentium ut quam
          nisi! Saepe repudiandae velit non optio consequatur delectus, repellendus fugit ratione nisi laudantium. Dolor repellat inventore
          tenetur. Distinctio dolor in autem deserunt? Quaerat officia voluptate accusantium reprehenderit quod eveniet officiis nemo ullam
          fugiat a quisquam earum illum nisi, id suscipit enim iste. Error necessitatibus nostrum possimus iusto a voluptatum reiciendis
          explicabo incidunt, distinctio ex ea quas repellendus et non blanditiis vitae iste. Ipsam asperiores ut quos. Neque ea quae
          voluptates sit! Saepe dolore perspiciatis ea nulla laudantium quos itaque vitae excepturi necessitatibus iste. Iste autem, est
          iure quis saepe natus doloribus quo sint eveniet rerum rem soluta corporis obcaecati exercitationem possimus aperiam labore odit
          dicta, ipsam, architecto omnis sequi at amet voluptatum. Enim laborum quasi reprehenderit quas dolor maiores suscipit, nisi
          accusantium velit rem non? Ullam, accusamus quibusdam! Nobis repudiandae aut quasi nemo deserunt, alias officiis laboriosam neque
          illo atque aliquid explicabo officia aspernatur sint necessitatibus at dolores architecto aliquam? Laudantium nulla id architecto
          ipsa tempora nobis aliquam dignissimos placeat eligendi, ab provident ad magnam enim accusantium ratione autem modi error
          assumenda quod deleniti, in praesentium illo iste dolorem! Consequatur assumenda eum tempore nostrum deserunt natus odio, possimus
          totam voluptates voluptatibus vel explicabo repudiandae consequuntur esse porro dolore asperiores dignissimos adipisci. Quae harum
          reprehenderit optio. Omnis nisi aspernatur necessitatibus itaque quae iusto nulla quo tenetur reiciendis quibusdam maxime,
          temporibus ad nobis corrupti architecto impedit incidunt libero laboriosam iure in deserunt assumenda at a. Nemo expedita dolores
          ducimus unde numquam ullam facere cumque consectetur tempora quam corrupti fugit voluptatem, harum, maxime illo accusamus alias
          nihil adipisci. Qui fugiat corporis esse dolore, tempora ullam recusandae facere rem commodi soluta delectus omnis expedita,
          illum, aliquam non eveniet animi vel inventore asperiores provident similique perspiciatis sunt praesentium officia. Voluptas,
          ipsam itaque, atque quasi illum a modi quaerat quae est labore quo eligendi tenetur fuga laboriosam minus cum error? Eveniet
          veniam veritatis adipisci similique reiciendis, ducimus tempore consequuntur magnam optio doloremque quaerat dolor omnis
          architecto ab impedit itaque? Ipsam deserunt ipsa aspernatur? Rem aperiam doloribus suscipit ipsum ut et alias animi velit ducimus
          rerum eaque accusamus omnis quos, nesciunt molestiae officia labore ipsam iusto inventore dolores reiciendis esse natus est.
          Incidunt deserunt molestias pariatur consequuntur unde laborum iste optio error, harum voluptatibus blanditiis assumenda dolores
          illum explicabo praesentium enim repudiandae! Cumque distinctio, at culpa optio fugiat in. A nobis ex quia eligendi ipsum cumque
          adipisci in vero quas consequatur aspernatur doloremque possimus ab quisquam, natus nulla veritatis. Voluptatibus eum, et enim
          tenetur optio error quia, architecto voluptates minima quae in ducimus vitae fugit fugiat perspiciatis repudiandae quas quo itaque
          pariatur doloribus aliquid, sunt eveniet! Facilis provident reprehenderit optio aspernatur possimus iure est eveniet unde esse
          porro eos, minima dicta eum quo animi iste ratione laborum molestiae repudiandae facere blanditiis ipsa quas necessitatibus
          placeat. Esse praesentium magni dicta deserunt natus? Pariatur inventore sed ratione consequuntur excepturi sequi molestiae quod
          nisi ea temporibus iure laborum sapiente provident ab eius quae officia vel, quaerat quidem repudiandae recusandae?
        </Text>
      </AppBottomSheet>
    </TabbedLayout>
  );
}
