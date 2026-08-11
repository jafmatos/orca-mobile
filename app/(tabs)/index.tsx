import { EntryListItem } from "@/components/entries/EntryListItem";
import { TabbedLayout } from "@/components/layouts/TabbedLayout";
import { Navigation } from "@/components/Navigation";
import { SubscriptionPromoCard } from "@/components/profile/SubscriptionPromoCard";
import { ScheduleListItem } from "@/components/schedules/ScheduleListItem";
import { AppHideableCurrencyText } from "@/components/ui/AppHideableCurrencyText";
import { AppSkeleton } from "@/components/ui/AppSkeleton";
import { AppConditional } from "@/components/utils/AppConditional";
import { useAnalyses } from "@/hooks/queries/use-ai-analyses";
import { useAuthUser } from "@/hooks/queries/use-auth-user";
import { useEntries } from "@/hooks/queries/use-entries";
import { useHasActiveSubscription } from "@/hooks/queries/use-has-active-subscription";
import { useKpis } from "@/hooks/queries/use-kpis";
import { useSchedules } from "@/hooks/queries/use-schedules";
import { MODAL_ROUTES, TAB_ROUTES, useAppRouter } from "@/hooks/use-app-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { PaginatedData } from "@/models/PaginatedData";
import { Schedule, ScheduleCycleStatus } from "@/models/Schedule";
import { CreateScheduleOccurrenceReturnType, ScheduleOccurrenceService } from "@/services/Api/ScheduleOccurrenceApiService";
import { currencyFormatter } from "@/utils/currencyFormatter";
import { QueryKeys } from "@/utils/QueryKeys";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Badge, Button, IconButton, List, Surface, Text } from "react-native-paper";

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
    <Pressable onPress={onPress} className="w-full flex items-center gap-2">
      <Surface
        elevation={1}
        className="w-full flex flex-row items-center justify-center"
        style={{
          backgroundColor: theme.colors.elevation.level1 || theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
          borderRadius: theme.roundness,
          height: 40,
        }}
      >
        <View className="relative flex flex-row items-center justify-center">
          {badgeCount !== undefined && badgeCount > 0 && <Badge className="absolute -top-2 -right-6 z-10">{badgeCount}</Badge>}

          <IconButton icon={icon} size={20} iconColor={theme.colors.primary} style={{ margin: 0 }} />

          <Text variant="labelMedium" style={{ fontWeight: "bold", marginLeft: 2, flexShrink: 1 }} numberOfLines={1} ellipsizeMode="tail">
            {label}
          </Text>
        </View>
      </Surface>
    </Pressable>
  );
}

function NewEntryShortcut() {
  const router = useAppRouter();

  return <ShortcutCard onPress={() => router.goToEntryManualForm()} icon="plus" label="Novo Lançamento" />;
}

function SchedulesShortcut(props: { pendingCount?: number }) {
  const router = useAppRouter();

  return (
    <ShortcutCard
      onPress={() => router.goToSchedules()}
      icon={TAB_ROUTES.schedules.icon}
      label={TAB_ROUTES.schedules.title}
      badgeCount={props.pendingCount}
    />
  );
}

function SmartEntryShortcut() {
  const router = useAppRouter();

  return <ShortcutCard onPress={() => router.goToEntrySmartForm()} icon="microphone-outline" label="Lanç. Inteligente" />;
}

function ChatAssistantShortcut() {
  const router = useAppRouter();

  return <ShortcutCard onPress={() => router.goToChat()} icon={MODAL_ROUTES.chatAssistant.icon} label={MODAL_ROUTES.chatAssistant.title} />;
}

export default function HomeScreen() {
  const authUserQuery = useAuthUser();
  const hasActiveSubscription = useHasActiveSubscription();
  const theme = useAppTheme();
  const router = useAppRouter();
  const kpisQuery = useKpis();
  const entriesQuery = useEntries();
  const schedulesQuery = useSchedules();
  const analysesQuery = useAnalyses();
  const queryClient = useQueryClient();

  const isResolvingHomeData =
    authUserQuery.isPending ||
    schedulesQuery.isPending ||
    entriesQuery.isPending ||
    (!!authUserQuery.data?.user?.subscription?.isActive && analysesQuery.isPending);

  const authUser = useMemo(() => authUserQuery.data?.user, [authUserQuery.data]);

  const createOccurrenceMutation = useMutation<CreateScheduleOccurrenceReturnType, Error, { schedule: Schedule }>({
    mutationFn: async ({ schedule }) => {
      const data = await ScheduleOccurrenceService.create(schedule.id, {
        when: new Date(),
      });

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueriesData<InfiniteData<PaginatedData<Schedule>>>({ queryKey: QueryKeys.Schedule.getSchedules() }, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((s) => {
              if (s.id !== variables.schedule.id) return s;
              let found = false;
              return {
                ...s,
                cycles: s.cycles?.map((cycle) => {
                  if (!found && cycle.status !== ScheduleCycleStatus.Done) {
                    found = true;
                    return { ...cycle, status: ScheduleCycleStatus.Done as any, occurrence: data.occurrence };
                  }
                  return cycle;
                }),
              };
            }),
          })),
        };
      });

      queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getKpis() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getMonthlyEvolution() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.Overview.getExpenseByCategory() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.Entry.getEntries() });
    },
  });

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 4) return "Boa noite";
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";

    return "Boa noite";
  }, []);

  const recentEntries = useMemo(() => {
    const allEntries = entriesQuery.data?.pages.flatMap((page) => page.data) || [];

    return allEntries.slice(0, 3);
  }, [entriesQuery.data]);

  const recentAnalysis = useMemo(() => {
    return analysesQuery.data?.pages?.[0]?.data?.[0];
  }, [analysesQuery.data]);

  const { pendingSchedules, pendingCount } = useMemo(() => {
    const allSchedules = schedulesQuery.data?.data || [];

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

  const showAntonioPlans = !!(
    hasActiveSubscription &&
    !analysesQuery.isPending &&
    !analysesQuery.isFetching &&
    !!recentAnalysis &&
    recentAnalysis.output.actions.length > 0
  );

  return (
    <TabbedLayout>
      <Navigation colored hideShadow={true} />

      <ScrollView contentContainerClassName="grow" style={{ backgroundColor: theme.colors.primary }} showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-2 pb-8">
          <Text variant="titleMedium" theme={{ colors: { onSurface: theme.colors.onPrimary } }}>
            {authUser ? `${greeting}, ${authUser.name.split(" ")[0]}!` : greeting}
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
          className="flex-1 flex flex-col pt-8 pb-20"
          style={{
            backgroundColor: theme.colors.background,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
          }}
        >
          <View className="mb-4">
            <Text variant="titleMedium" className="px-4 mb-1" style={{ fontWeight: "bold", letterSpacing: -0.2 }}>
              Atalhos Rápidos
            </Text>

            <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }} contentContainerClassName="px-4 py-3">
              <AppConditional
                if={hasActiveSubscription}
                _then={
                  <>
                    <SmartEntryShortcut />
                    <ChatAssistantShortcut />
                    <SchedulesShortcut pendingCount={pendingCount} />
                  </>
                }
                _else={
                  <>
                    <NewEntryShortcut />
                    <SchedulesShortcut pendingCount={pendingCount} />
                  </>
                }
              />
            </ScrollView>
          </View>

          <AppConditional
            if={!isResolvingHomeData}
            _then={
              <>
                <AppConditional
                  if={!hasActiveSubscription}
                  _then={
                    <View className="px-4 mb-8">
                      <SubscriptionPromoCard />
                    </View>
                  }
                />

                <AppConditional
                  if={showAntonioPlans}
                  _then={
                    <View className="px-4 py-4">
                      <View className="flex flex-row justify-between items-center mb-3">
                        <Text variant="titleMedium" style={{ fontWeight: "bold", letterSpacing: -0.2 }}>
                          Planos de Ação do Antônio
                        </Text>

                        <Button onPress={() => router.goToAnalyses()} compact>
                          Ver Tudo
                        </Button>
                      </View>

                      <View className="flex flex-col">
                        <List.AccordionGroup>
                          {recentAnalysis?.output.actions.slice(0, 3).map((action, i) => (
                            <List.Accordion
                              key={i}
                              id={i.toString()}
                              title={action.title}
                              titleNumberOfLines={2}
                              titleStyle={{ fontSize: 14, color: theme.colors.onSurface, fontWeight: "semibold" }}
                              left={(props) => <List.Icon {...props} icon="lightbulb-on-outline" color={theme.colors.primary} />}
                              style={{ backgroundColor: "transparent", paddingHorizontal: 0 }}
                            >
                              <List.Item
                                title={`Por quê? ${action.effect}`}
                                titleNumberOfLines={10}
                                titleStyle={{ fontSize: 14, color: theme.colors.onSurfaceVariant, fontStyle: "italic" }}
                                style={{ paddingLeft: 16, paddingRight: 0, paddingTop: 0, paddingBottom: 16 }}
                              />
                            </List.Accordion>
                          ))}
                        </List.AccordionGroup>
                      </View>
                    </View>
                  }
                  _else={
                    <AppConditional
                      if={pendingCount > 0}
                      _then={
                        <View className="px-4 py-4">
                          <View className="flex flex-row justify-between items-center mb-3">
                            <Text variant="titleMedium" style={{ fontWeight: "bold", letterSpacing: -0.2 }}>
                              Contas Atrasadas
                            </Text>
                            <Button onPress={() => router.goToSchedules()} compact>
                              Ver Todas
                            </Button>
                          </View>

                          <View className="flex gap-4">
                            {pendingSchedules.map(({ schedule, cycle }) => (
                              <ScheduleListItem
                                key={`${schedule.id}-${cycle.expectedDate}`}
                                schedule={schedule}
                                onCheckPress={(s) => createOccurrenceMutation.mutate({ schedule: s })}
                                onPress={() => router.goToSchedules()}
                              />
                            ))}
                          </View>
                        </View>
                      }
                      _else={
                        <AppConditional
                          if={!entriesQuery.isPending && !entriesQuery.isFetching && !!recentEntries.length}
                          _then={
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
                              ) : (
                                <View className="flex gap-4">
                                  {recentEntries.map((entry) => (
                                    <EntryListItem key={entry.id} data={entry} onPress={() => router.goToEntries()} />
                                  ))}
                                </View>
                              )}
                            </View>
                          }
                        />
                      }
                    />
                  }
                />
              </>
            }
            _else={
              <View className="px-4 mt-4 flex gap-4">
                <View className="flex flex-row justify-between items-center mb-1">
                  <AppSkeleton height={24} width={180} />
                  <AppSkeleton height={36} width={80} />
                </View>
                <AppSkeleton height={70} />
                <AppSkeleton height={70} />
                <AppSkeleton height={70} />
              </View>
            }
          />
        </View>
      </ScrollView>
    </TabbedLayout>
  );
}
