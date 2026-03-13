import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { Text } from "react-native";

export default function DashboardScreen() {
  return (
    <TabbedLayout>
      <Navigation />
      <Text>DashboardScreen</Text>
    </TabbedLayout>
  );
}
