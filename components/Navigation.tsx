import {
	Button,
	ButtonIcon,
	ButtonText,
	Divider, Pressable,
	Text
} from "@gluestack-ui/themed";
import { AppAvatar } from "./ui/AppAvatar";
import {
	LucideIcon,
	MenuIcon,
	HomeIcon,
	ReceiptTextIcon,
	BookmarkIcon,
	ChartPieIcon,
	UserIcon,
	OctagonAlertIcon,
	ClockIcon,
	SparklesIcon,
	LogOutIcon,
} from "lucide-react-native";
import useAppThemeColors from "@/hooks/use-app-theme-colors";
import { AppDrawer } from "./ui/AppDrawer";
import { useState } from "react";
import { Portal } from "@gorhom/portal";
import { Link, usePathname, useRouter } from "expo-router";
import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { View } from "react-native";

interface DrawerNavigationItemProps {
  icon?: LucideIcon;
  onPressCallback?: () => void;
  text: string;
  to: React.ComponentProps<typeof Link>["href"];
}

function DrawerNavigationItem({ icon: Icon, ...props }: DrawerNavigationItemProps) {
  const router = useRouter();
  const themeColors = useAppThemeColors();
  const pathname = usePathname();
  const isActive = pathname === props.to;

  return (
    <Pressable
      onPress={() => {
        router.push(props.to);

        props.onPressCallback?.();
      }}
    >
      <View
        className={`rounded-lg relative w-full p-4 flex flex-row items-center gap-3`}
        style={{
          backgroundColor: isActive ? "#f2850710" : "none",
          // backgroundColor: "#f2850710",
        }}
      >
        {Icon ? <Icon size={18} color={isActive ? themeColors["--color-primary-500"] : themeColors["--color-typography-0"]} /> : <></>}
        <Text size="md" fontWeight={500} color={isActive ? themeColors["--color-primary-500"] : themeColors["--color-typography-0"]}>
          {props.text}
        </Text>
      </View>
    </Pressable>
  );
}

export function Navigation() {
  const user = useAuthUser();
  const themeColors = useAppThemeColors();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <View
        className="h-[72px] px-4 flex flex-row justify-between items-center bg-background-950"
        style={{
          boxShadow: `0 1px 3px -5px blue`,
        }}
      >
        <AppAvatar />
        <Pressable onPress={() => setIsDrawerOpen(true)}>
          <MenuIcon size={32} color={themeColors["--color-typography-0"]} />
        </Pressable>
      </View>
      <Portal hostName="drawer">
        <AppDrawer
          className="p-6 flex flex-col gap-4"
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
        >
          <View className="flex flex-row gap-2 items-center">
            <AppAvatar />
            <View className="flex flex-col">
              <Text size="sm" fontWeight={600}>
                {user?.name}
              </Text>
              <Text size="sm" color="$typography400">
                {user?.email}
              </Text>
            </View>
          </View>
          <Divider bgColor="$typography0" opacity={0.1} />
          <View className="grow flex flex-col">
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/"} icon={HomeIcon} text="Início" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/entries"} icon={ReceiptTextIcon} text="Lançamentos" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/schedules"} icon={ClockIcon} text="Agendamentos" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/categories"} icon={BookmarkIcon} text="Categorias" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/limits"} icon={OctagonAlertIcon} text="Limites" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/dashboard"} icon={ChartPieIcon} text="Visão Geral" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/analyses"} icon={SparklesIcon} text="Análises" />
            <DrawerNavigationItem onPressCallback={closeDrawer} to={"/profile"} icon={UserIcon} text="Meu Perfil" />
          </View>
          <Button
            className="flex flex-row items-center gap-2"
            backgroundColor={themeColors["--color-danger-500"]}
          >
            <ButtonText color={themeColors["--color-on-danger"]}>Sair</ButtonText>
            <ButtonIcon color={themeColors["--color-on-danger"]} as={LogOutIcon} />
          </Button>
        </AppDrawer>
      </Portal>
    </>
  );
}
