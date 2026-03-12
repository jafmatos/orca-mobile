import { SignInService } from "@/services/Auth/SignInService";
import { useQuery } from "@tanstack/react-query";

export const useAuthUser = () => {
  const { data } = useQuery({
    queryKey: ["auth-user"],
    queryFn: SignInService.getProfile,
    retry: false,
    retryOnMount: true,
  });

  return data?.user;
};
