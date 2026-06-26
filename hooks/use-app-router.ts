import { useRouter } from "expo-router";

export function useAppRouter() {
  const router = useRouter();

  return {
    ...router,
    goToSignIn: () => router.replace("/(auth)/sign-in"),
    goToSignUp: () => router.replace("/(auth)/sign-up"),
    goToSignUpConfirm: (id: string) =>
      router.push({
        pathname: "/(auth)/sign-up/confirm/[id]",
        params: {
          id,
        },
      }),
    goToResetPassword: () => router.push("/(auth)/reset-password"),
    goToResetPasswordConfirm: (id: string) =>
      router.push({
        pathname: "/(auth)/reset-password/confirm/[id]",
        params: {
          id,
        },
      }),
    goToHome: () => router.push("/(tabs)"),
    goToEntries: () => router.push("/(tabs)/entries"),
    goToSchedules: () => router.push("/(tabs)/schedules"),
    goToCategories: () => router.push("/(tabs)/categories"),
    goToOverview: () => router.push("/(tabs)/overview"),
    goToAnalyses: () => router.push("/(tabs)/analyses"),
    goToProfile: () => router.push("/(tabs)/profile"),
    goToCategoryForm: (id?: string) => {
      if (id) router.push(`/(modals)/category-form?id=${id}`);
      else router.push("/(modals)/category-form");
    },
    goToEntryManualForm: (id?: string) => {
      if (id) router.push(`/(modals)/entry-manual-form?id=${id}`);
      else router.push("/(modals)/entry-manual-form");
    },
    goToEntrySmartForm: () => router.push("/(modals)/entry-smart-form"),
    goToEntrySearch: () => router.push("/(modals)/entry-search"),
    goToScheduleForm: (id?: string) => {
      if (id) router.push(`/(modals)/schedule-form?id=${id}`);
      else router.push("/(modals)/schedule-form");
    },
    goToProfileForm: () => router.push("/(modals)/profile-form"),
    goToManageSubscription: () => router.push("/(modals)/manage-subscription"),
    goToSettings: () => router.push("/(modals)/settings"),
  };
}
