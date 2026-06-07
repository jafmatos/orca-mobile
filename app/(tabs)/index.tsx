import { EntryListItem } from "@/components/entries/EntryListItem";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { BalanceCard } from "@/components/overview/BalanceCard";
import { ExpenseCard } from "@/components/overview/ExpenseCard";
import { IncomeCard } from "@/components/overview/IncomeCard";
import { ScheduleListItem } from "@/components/schedules/ScheduleListItem";
import { AppHideableCurrencyText } from "@/components/ui/AppHideableCurrencyText";
import { AppSkeleton } from "@/components/ui/AppSkeleton";
import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { useEntries } from "@/hooks/queries/use-entries";
import { useKpis } from "@/hooks/queries/use-kpis";
import { useSchedules } from "@/hooks/queries/use-schedules";
import { useAppRouter } from "@/hooks/use-app-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { ScheduleCycleStatus } from "@/models/Schedule";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Badge, Button, IconButton, Surface, Text } from "react-native-paper";

export function ShortcutCard({
  icon,
  label,
  onPress,
  badgeCount,
}: {
  icon: string;
  label: string;
  onPress: () => void;
  badgeCount?: number;
}) {
  const theme = useAppTheme();

  return (
    <Pressable onPress={onPress} className="flex items-center gap-2">
      <View className="relative">
        {badgeCount !== undefined && badgeCount > 0 && <Badge className="absolute -top-2 -right-2 z-10">{badgeCount}</Badge>}
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
      </View>

      <Text variant="labelMedium" style={{ fontWeight: "bold", marginLeft: 2, flexShrink: 1 }} numberOfLines={1} ellipsizeMode="tail">
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
  const schedulesQuery = useSchedules();

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

  const { pendingSchedules, pendingCount } = useMemo(() => {
    const allSchedules = schedulesQuery.data?.pages.flatMap((page) => page.data) || [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();

    let count = 0;
    const pendingList = [];

    for (const schedule of allSchedules) {
      let relevantCycle = schedule.cycles?.[0];
      if (schedule.cycles && schedule.cycles.length > 0) {
        let maxPastCycle = null;
        let maxPastTime = -Infinity;

        for (const cycle of schedule.cycles) {
          const cycleDate = new Date(cycle.expectedDate);
          cycleDate.setHours(0, 0, 0, 0);
          const cycleTime = cycleDate.getTime();

          if (cycleTime <= todayTime && cycleTime > maxPastTime) {
            maxPastTime = cycleTime;
            maxPastCycle = cycle;
          }
        }

        if (maxPastCycle) {
          relevantCycle = maxPastCycle;
        }
      }

      if (relevantCycle && relevantCycle.status !== ScheduleCycleStatus.Done) {
        count++;
        pendingList.push({ schedule, cycle: relevantCycle });
      }
    }

    // Sort pending schedules by date ascending
    pendingList.sort((a, b) => new Date(a.cycle.expectedDate).getTime() - new Date(b.cycle.expectedDate).getTime());

    return { pendingSchedules: pendingList.slice(0, 3), pendingCount: count };
  }, [schedulesQuery.data]);

  return (
    <TabbedLayout className="flex-1">
      <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
        <Navigation colored backgroundColor={theme.colors.primary} hideShadow={true} />

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View className="px-4 pt-2 pb-8">
            <Text variant="titleMedium" theme={{ colors: { onSurface: theme.colors.onPrimary } }}>
              {greeting}, {user?.name.split(" ")[0] || "usuário"}!
            </Text>

            <View className="mt-4">
              {kpisQuery.isPending || kpisQuery.isFetching ? (
                <AppSkeleton height={36} width={150} color={theme.colors.onPrimaryContainer} />
              ) : (
                <AppHideableCurrencyText
                  variant="headlineLarge"
                  theme={{ colors: { onSurface: theme.colors.onPrimary } }}
                  style={{ fontWeight: "bold", letterSpacing: -0.5 }}
                >
                  {currencyFormatter.format(kpisQuery.data?.status.balance || 0)}
                </AppHideableCurrencyText>
              )}

              <Text className="mt-2" variant="bodyMedium" theme={{ colors: { onSurface: theme.colors.onPrimary } }}>
                Saldo disponível
              </Text>
            </View>
          </View>

          <View
            className="flex-1 flex flex-col pt-6 pb-20"
            style={{
              backgroundColor: theme.colors.background,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              minHeight: 600,
            }}
          >
            <View className="px-4 mb-8 flex flex-row gap-4">
              <IncomeCard amount={kpisQuery.data?.status.totalIncome} loading={kpisQuery.isPending || kpisQuery.isFetching} />
              <ExpenseCard amount={kpisQuery.data?.status.totalExpense} loading={kpisQuery.isPending || kpisQuery.isFetching} />
            </View>

            <View className="mb-4">
              <Text variant="titleMedium" className="px-4 mb-1" style={{ fontWeight: "bold", letterSpacing: -0.2 }}>
                Atalhos Rápidos
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16 }}
                contentContainerClassName="px-4 py-3"
              >
                <ShortcutCard onPress={() => router.goToSchedules()} icon="clock" label="Agendamentos" badgeCount={pendingCount} />

                <ShortcutCard onPress={() => router.goToAnalyses()} icon="creation" label="Análises" />
              </ScrollView>
            </View>

            <View className="py-4 px-4">
              <View className="flex flex-row justify-between items-center mb-3">
                <Text variant="titleMedium" style={{ fontWeight: "bold", letterSpacing: -0.2 }}>
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
          </View>
        </ScrollView>
      </View>
    </TabbedLayout>
  );
}
