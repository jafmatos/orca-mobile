import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import { Button, ButtonText, ScrollView, Text } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <TabbedLayout>
      <ScrollView style={{ flex: 1 }}>
        <Button
          backgroundColor="$danger500"
          onPress={() => {
            AppAuthenticationTokenStore.remove();
            router.push("/(auth)/sign-in");
          }}
        >
          <ButtonText color="$onDanger">Sair</ButtonText>
        </Button>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium quia odit voluptatum cumque omnis nihil dignissimos aliquid,
          corrupti incidunt rerum nostrum sequi at amet veritatis vero est dolore ea quis, provident impedit! Blanditiis voluptatum placeat
          tenetur veniam velit vitae maxime consequatur dignissimos consequuntur eum possimus quas nesciunt temporibus at voluptatem nostrum
          alias eius, quod repudiandae laudantium? Sint suscipit asperiores aperiam! Ea magnam repudiandae nesciunt, voluptates eligendi
          architecto laboriosam id aspernatur natus iure dolores cupiditate aliquam exercitationem impedit vitae dolorum? Placeat sequi
          harum doloremque nobis ullam, ex minus ipsa animi sed odit enim natus! Et, molestiae accusantium adipisci eos fugit minus at omnis
          dicta hic ipsum illo numquam sequi dolor dolorem modi consequuntur! Ullam autem rerum quaerat itaque quidem beatae ad obcaecati
          maxime eaque provident nulla unde reprehenderit magnam dignissimos dolorum, necessitatibus praesentium. Obcaecati repudiandae,
          facere eos quibusdam ex harum sit magnam dolores dignissimos temporibus voluptates asperiores atque quos totam amet, deserunt
          ducimus vitae accusamus tenetur impedit modi fugit! Exercitationem natus fugit soluta. Eos, vel odit eveniet, nesciunt laboriosam
          nam repudiandae iure itaque qui, dignissimos dolor adipisci ab aliquid porro perspiciatis ipsam possimus debitis? Voluptatum quos
          beatae accusantium magnam dolorem sunt rerum voluptates ipsa, temporibus iste natus corporis fugit dolorum quas quasi deleniti
          odio consequuntur impedit architecto odit, non laboriosam commodi? Modi ad dolorum laborum labore recusandae autem illo quos
          facilis, provident distinctio ratione possimus ut consequuntur nobis, saepe excepturi. Alias unde molestias debitis commodi
          veniam! Quas vitae debitis voluptatum dignissimos sit suscipit illo, impedit, voluptatibus maiores, laboriosam earum inventore est
          animi culpa fugit quaerat labore similique eveniet. Perspiciatis iusto, vel porro ad, voluptatum nesciunt maxime voluptate aperiam
          quod rem esse officia debitis adipisci velit eaque nemo sequi accusantium architecto dolorum, itaque voluptates voluptas quia.
          Nobis ex non illo cupiditate adipisci magnam ipsam temporibus deleniti alias, provident est fugiat sequi voluptatem sapiente
          laboriosam inventore ducimus dolorem sunt doloribus eos, voluptatibus autem nisi modi vel. Obcaecati aspernatur autem quia
          voluptatum, eligendi qui corrupti ipsa laboriosam consectetur aliquid consequuntur minima asperiores, sapiente rerum ad incidunt
          assumenda cumque quibusdam. Minus autem suscipit eaque debitis dolor quis aspernatur nam corrupti exercitationem. Temporibus
          consequuntur culpa exercitationem perspiciatis beatae nam in enim error sunt minus quos, necessitatibus nobis eos excepturi
          blanditiis aspernatur iste dolore, dicta laudantium ipsam nemo quis recusandae libero suscipit. Eaque consectetur in commodi sed
          autem beatae earum voluptates at sunt vel debitis amet deserunt excepturi, numquam facilis. Eaque corrupti veritatis quisquam illo
          non numquam cum nobis asperiores itaque explicabo modi ab, doloribus quos ratione officiis error quia quo cupiditate dolorem
          consequatur architecto. Reiciendis, aliquam qui deleniti enim quam, quo totam, laboriosam dolorem id vero consequuntur aliquid
          aspernatur esse quas sapiente odio. Architecto, perferendis reprehenderit earum animi labore, illo, fuga nisi laboriosam porro
          eius iusto iste veniam minus consequuntur soluta praesentium eaque tenetur aspernatur nam facere harum quidem doloremque unde
          officia! Inventore modi sint similique ipsum esse, sunt ratione blanditiis? Rem quia quidem debitis. Recusandae libero similique
          ipsum eveniet provident ipsa soluta reprehenderit ab numquam, dolores enim in odio commodi labore temporibus sunt sit officia!
        </Text>
      </ScrollView>
    </TabbedLayout>
  );
}
