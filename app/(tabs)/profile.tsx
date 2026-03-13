import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { Text } from "react-native";

export default function ProfileScreen() {
  return (
    <TabbedLayout>
      {" "}
      <Navigation />
      <Text>ProfileScreen</Text>
    </TabbedLayout>
  );
}
