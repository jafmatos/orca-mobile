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
    <Pressable onPress={onPress} className="flex-1 min-w-[45%]">
      <Surface
        elevation={1}
        className="flex flex-row items-center px-2"
        style={{
          backgroundColor: theme.colors.elevation.level1 || theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
          borderRadius: theme.roundness,
          height: 56,
        }}
      >
        <IconButton icon={icon} size={20} iconColor={theme.colors.primary} style={{ margin: 0 }} />
        <Text variant="labelMedium" style={{ fontWeight: "bold", marginLeft: 2 }} numberOfLines={1} ellipsizeMode="tail">
          {label}
        </Text>
      </Surface>
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

      <ScrollView style={{ flex: 1 }} contentContainerClassName="p-4 flex gap-6" showsVerticalScrollIndicator={false}>
        <View>
          <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>
            {greeting}, {user?.name.split(" ")[0] || "usuário"}!
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {formattedDate}
          </Text>
        </View>

        <View className="flex flex-col gap-4">
          {user?.balance !== undefined ? <BalanceCard amount={user.balance} /> : <AppSkeleton height={90} />}

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

        <View>
          <Text variant="titleMedium" className="mb-3" style={{ fontWeight: "bold" }}>
            Atalhos Rápidos
          </Text>

          <View className="flex flex-row justify-between flex-wrap gap-4">
            <ShortcutCard onPress={() => router.goToOverview()} icon="chart-donut" label="Visão Geral" />

            <ShortcutCard onPress={() => router.goToLimits()} icon="alert-octagon" label="Limites" />

            <ShortcutCard onPress={() => router.goToEntries()} icon="plus" label="Novo Lançamento" />
          </View>
        </View>

        <View>
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
