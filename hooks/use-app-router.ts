import { useRouter } from "expo-router";

export function useAppRouter() {
  const router = useRouter();

  return {
    ...router,
    goToSignIn: () => router.push("/(auth)/sign-in"),
    goToSignUp: () => router.push("/(auth)/sign-up"),
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
    goToLimits: () => router.push("/(tabs)/limits"),
    goToOverview: () => router.push("/(tabs)/overview"),
    goToAnalyses: () => router.push("/(tabs)/analyses"),
    goToProfile: () => router.push("/(tabs)/profile"),
  };
}
