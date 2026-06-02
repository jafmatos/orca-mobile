import { SignInService } from "@/services/Users/Auth/SignInService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useAuthUser = () => {
  const { data } = useQuery({
    queryKey: QueryKeys.User.getAuthUser(),
    queryFn: SignInService.getProfile,
    retry: false,
    retryOnMount: true,
  });

  return data?.user;
};
