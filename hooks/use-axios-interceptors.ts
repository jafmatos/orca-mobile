import { $axios } from "@/utils/$axios";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import { AxiosError } from "axios";
import { useAppRouter } from "./use-app-router";
import { queryClient } from "@/app/_layout";
import { usePathname } from "expo-router";

export const useAxiosInterceptors = () => {
  const router = useAppRouter();
  const pathname = usePathname();

  $axios.interceptors.request.use(
    (config) => {
      console.log(`[axios] request ${config.url}`);
      const authenticationToken = AppAuthenticationTokenStore.get();

      if (authenticationToken) {
        config.headers.Authorization = `Bearer ${authenticationToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
    {},
  );

  $axios.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log(`[axios] response ${error.message}`);
      if (error instanceof AxiosError && error.response?.status === 401) {
        AppAuthenticationTokenStore.remove();
        queryClient.clear();

        if (pathname !== "/sign-in") {
          router.goToSignIn();
        }
      }

      return Promise.reject(error);
    },
  );
};
