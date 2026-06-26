import { SignInService } from "@/services/Api/Users/Auth/SignInApiService";
import { QueryKeys } from "@/utils/QueryKeys";
import { useQuery } from "@tanstack/react-query";

export const useAuthUser = () => {
  return useQuery({
    queryKey: QueryKeys.User.getAuthUser(),
    queryFn: SignInService.getProfile,
    retry: false,
  });
};
