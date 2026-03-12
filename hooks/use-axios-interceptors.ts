import { $axios } from "@/utils/$axios";
import { AppAuthenticationTokenStore } from "@/utils/AuthenticationTokenStore";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";

export const useAxiosInterceptors = () => {
  const router = useRouter();

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

        router.push("/(auth)/sign-in");
      }

      return Promise.reject(error);
    },
  );
};
