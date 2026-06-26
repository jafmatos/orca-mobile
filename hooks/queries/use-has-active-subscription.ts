import { useMemo } from "react";
import { useAuthUser } from "./use-auth-user";

export const useHasActiveSubscription = () => {
  const authUserQuery = useAuthUser();

  const hasActiveSubscription = useMemo(() => {
    return !!authUserQuery.data?.user?.subscription?.isActive;
  }, [authUserQuery.data]);

  return hasActiveSubscription;
};
