import { useRouter } from "expo-router";

type RoutePath = Parameters<ReturnType<typeof useRouter>["push"]>[0];

type Route = {
  name?: string;
  path: RoutePath;
  title?: string;
  icon?: string;
};

export const GLOBAL_ROUTES = {
  tabs: {
    name: "(tabs)",
    path: "/(tabs)",
  },
  signIn: {
    name: "(auth)/sign-in",
    path: "/(auth)/sign-in",
  },
  signUp: {
    name: "(auth)/sign-up/index",
    path: "/(auth)/sign-up",
  },
  signUpConfirm: {
    name: "(auth)/sign-up/confirm/[id]",
    path: "/(auth)/sign-up/confirm/[id]",
  },
  resetPassword: {
    name: "(auth)/reset-password/index",
    path: "/(auth)/reset-password",
  },
  resetPasswordConfirm: {
    name: "(auth)/reset-password/confirm/[id]",
    path: "/(auth)/reset-password/confirm/[id]",
  },
} as const satisfies Record<string, Route>;

export const TAB_ROUTES = {
  home: {
    name: "index",
    path: "/(tabs)",
    title: "Home",
    icon: "home-outline",
  },
  entries: {
    name: "entries",
    path: "/(tabs)/entries",
    title: "Lançamentos",
    icon: "receipt-text-outline",
  },
  categories: {
    name: "categories",
    path: "/(tabs)/categories",
    title: "Categorias",
    icon: "bookmark-outline",
  },
  overview: {
    name: "overview",
    path: "/(tabs)/overview",
    title: "Visão Geral",
    icon: "chart-donut-variant",
  },
  profile: {
    name: "profile",
    path: "/(tabs)/profile",
    title: "Meu Perfil",
    icon: "account-outline",
  },
  schedules: {
    name: "schedules",
    path: "/(tabs)/schedules",
    title: "Agendamentos",
    icon: "clock-outline",
  },
  analyses: {
    name: "analyses",
    path: "/(tabs)/analyses",
    title: "Análises",
    icon: "creation-outline",
  },
} as const satisfies Record<string, Route>;

export const MODAL_ROUTES = {
  categoryForm: {
    name: "(modals)/category-form",
    path: "/(modals)/category-form",
  },
  entryManualForm: {
    name: "(modals)/entry-manual-form",
    path: "/(modals)/entry-manual-form",
  },
  entrySmartForm: {
    name: "(modals)/entry-smart-form",
    path: "/(modals)/entry-smart-form",
  },
  entrySearch: {
    name: "(modals)/entry-search",
    path: "/(modals)/entry-search",
  },
  scheduleForm: {
    name: "(modals)/schedule-form",
    path: "/(modals)/schedule-form",
  },
  profileForm: {
    name: "(modals)/profile-form",
    path: "/(modals)/profile-form",
  },
  billingPortal: {
    name: "(modals)/billing-portal",
    path: "/(modals)/billing-portal",
  },
  subscriptionSuccess: {
    name: "(modals)/subscription-success",
    path: "/(modals)/subscription-success",
  },
  settings: {
    name: "(modals)/settings",
    path: "/(modals)/settings",
    title: "Configurações",
    icon: "cog-outline",
  },
  chatAssistant: {
    name: "(modals)/chat-assistant",
    path: "/(modals)/chat-assistant",
    title: "Assistente",
    icon: "robot-outline",
  },
  plans: {
    name: "(modals)/plans",
    path: "/plans",
  },
} as const satisfies Record<string, Route>;

type RouteKeys = keyof typeof TAB_ROUTES | keyof typeof GLOBAL_ROUTES | keyof typeof MODAL_ROUTES;

export const ROUTES = { ...TAB_ROUTES, ...GLOBAL_ROUTES, ...MODAL_ROUTES } as const satisfies Record<RouteKeys, Route>;

export function useAppRouter() {
  const router = useRouter();

  return {
    ...router,
    goToSignIn: () => router.replace(ROUTES.signIn.path),
    goToSignUp: () => router.replace(ROUTES.signUp.path),
    goToSignUpConfirm: (id: string) =>
      router.push({
        pathname: ROUTES.signUpConfirm.path,
        params: {
          id,
        },
      }),
    goToResetPassword: () => router.push(ROUTES.resetPassword.path),
    goToResetPasswordConfirm: (id: string) =>
      router.push({
        pathname: ROUTES.resetPasswordConfirm.path,
        params: {
          id,
        },
      }),
    goToPlans: () => router.push(ROUTES.plans.path),
    goToHome: () => router.push(ROUTES.home.path),
    goToEntries: () => router.push(ROUTES.entries.path),
    goToSchedules: () => router.push(ROUTES.schedules.path),
    goToCategories: () => router.push(ROUTES.categories.path),
    goToOverview: () => router.push(ROUTES.overview.path),
    goToAnalyses: () => router.push(ROUTES.analyses.path),
    goToProfile: () => router.push(ROUTES.profile.path),
    goToCategoryForm: (id?: string) => {
      if (id)
        router.push({
          pathname: ROUTES.categoryForm.path,
          params: {
            id,
          },
        });
      else router.push(ROUTES.categoryForm.path);
    },
    goToEntryManualForm: (id?: string) => {
      if (id)
        router.push({
          pathname: ROUTES.entryManualForm.path,
          params: {
            id,
          },
        });
      else router.push(ROUTES.entryManualForm.path);
    },
    goToEntrySmartForm: () => router.push(ROUTES.entrySmartForm.path),
    goToEntrySearch: () => router.push(ROUTES.entrySearch.path),
    goToScheduleForm: (id?: string) => {
      if (id)
        router.push({
          pathname: ROUTES.scheduleForm.path,
          params: {
            id,
          },
        });
      else router.push(ROUTES.scheduleForm.path);
    },
    goToProfileForm: () => router.push(ROUTES.profileForm.path),
    goToBillingPortal: () => router.push(ROUTES.billingPortal.path),
    goToSubscriptionSuccess: () => router.push(ROUTES.subscriptionSuccess.path),
    goToSettings: () => router.push(ROUTES.settings.path),
    goToChat: () => router.push(ROUTES.chatAssistant.path),
  };
}
