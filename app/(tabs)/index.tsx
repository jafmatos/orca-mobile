import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { useAppToast } from "@/hooks/use-app-toast";
import { Button, ButtonText } from "@gluestack-ui/themed";

export default function HomeScreen() {
  const toast = useAppToast();

  return (
    <TabbedLayout>
      <Button
        onPress={() =>
          toast.success({
            title: "Sucesso!",
          })
        }
      >
        <ButtonText>Sucesso</ButtonText>
      </Button>
    </TabbedLayout>
  );
}
