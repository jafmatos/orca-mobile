import { $axios } from "@/utils/$axios";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import { AxiosError } from "axios";
import { useAppRouter } from "./use-app-router";

export const useAxiosInterceptors = () => {
  const router = useAppRouter();

  $axios.interceptors.request.use(
    (config) => {
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
      if (error instanceof AxiosError && error.response?.status === 401) {
        AppAuthenticationTokenStore.remove();

        router.goToSignIn();
      }

      return Promise.reject(error);
    },
  );
};
