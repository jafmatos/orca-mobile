import { EntryListItem } from "@/components/entries/EntryListItem";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { BalanceCard } from "@/components/overview/BalanceCard";
import { ExpenseCard } from "@/components/overview/ExpenseCard";
import { IncomeCard } from "@/components/overview/IncomeCard";
import { AppSkeleton } from "@/components/ui/AppSkeleton";
import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { useEntries } from "@/hooks/queries/use-entries";
import { useKpis } from "@/hooks/queries/use-kpis";
import { useAppRouter } from "@/hooks/use-app-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Button, IconButton, Surface, Text } from "react-native-paper";

export function ShortcutCard({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  const theme = useAppTheme();

  return (
    <Pressable onPress={onPress} className="flex items-center gap-2">
      <Surface
        elevation={1}
        className="flex flex-row items-center justify-center"
        style={{
          backgroundColor: theme.colors.elevation.level1 || theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
          borderRadius: theme.roundness,
          width: 96,
          height: 56,
        }}
      >
        <IconButton icon={icon} size={20} iconColor={theme.colors.primary} style={{ margin: 0 }} />
      </Surface>

      <Text variant="labelMedium" style={{ fontWeight: "bold", marginLeft: 2 }} numberOfLines={1} ellipsizeMode="tail">
        {label}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const user = useAuthUser();
  const theme = useAppTheme();
  const router = useAppRouter();

  const kpisQuery = useKpis();
  const entriesQuery = useEntries();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 4) return "Boa noite";
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";

    return "Boa noite";
  }, []);

  const formattedDate = useMemo(() => {
    const date = new Date();
    const weekday = date.toLocaleDateString("pt-BR", { weekday: "long" });
    const day = date.getDate();
    const month = date.toLocaleDateString("pt-BR", { month: "long" });

    return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} de ${month}`;
  }, []);

  const recentEntries = useMemo(() => {
    const allEntries = entriesQuery.data?.pages.flatMap((page) => page.data) || [];

    return allEntries.slice(0, 3);
  }, [entriesQuery.data]);

  return (
    <TabbedLayout>
      <Navigation />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View className="p-4 mb-2">
          <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>
            {greeting}, {user?.name.split(" ")[0] || "usuário"}!
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {formattedDate}
          </Text>
        </View>

        <View className="px-4 mb-6 flex flex-col gap-4">
          {kpisQuery.isPending || kpisQuery.isFetching ? (
            <AppSkeleton height={110} />
          ) : (
            <BalanceCard amount={kpisQuery.data?.status.balance} />
          )}

          <View className="flex flex-row gap-4 ">
            {kpisQuery.isPending || kpisQuery.isFetching ? (
              <AppSkeleton height={90} />
            ) : (
              <IncomeCard amount={kpisQuery.data?.status.totalIncome} />
            )}
            {kpisQuery.isPending || kpisQuery.isFetching ? (
              <AppSkeleton height={90} />
            ) : (
              <ExpenseCard amount={kpisQuery.data?.status.totalExpense} />
            )}
          </View>
        </View>

        <View className="mb-2">
          <Text variant="titleMedium" className="px-4 mb-3" style={{ fontWeight: "bold" }}>
            Atalhos Rápidos
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
            contentContainerClassName="px-4"
          >
            <ShortcutCard onPress={() => router.goToAnalyses()} icon="creation" label="Análises" />

            <ShortcutCard onPress={() => router.goToLimits()} icon="clock" label="Agendamentos" />
          </ScrollView>
        </View>

        <View className="py-4 px-4">
          <View className="flex flex-row justify-between items-center mb-3">
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
              Lançamentos Recentes
            </Text>
            <Button onPress={() => router.goToEntries()} compact>
              Ver Todos
            </Button>
          </View>

          {entriesQuery.isPending || entriesQuery.isFetching ? (
            <View className="flex gap-4">
              <AppSkeleton height={70} />
              <AppSkeleton height={70} />
              <AppSkeleton height={70} />
            </View>
          ) : recentEntries.length === 0 ? (
            <Surface
              className="p-6 rounded-xl flex items-center justify-center border"
              style={{ borderColor: theme.colors.outlineVariant }}
            >
              <Text style={{ color: theme.colors.onSurfaceVariant }}>Não há lançamentos registrados</Text>
            </Surface>
          ) : (
            <View className="flex gap-4">
              {recentEntries.map((entry) => (
                <EntryListItem key={entry.id} data={entry} onPress={() => router.goToEntries()} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </TabbedLayout>
  );
}
