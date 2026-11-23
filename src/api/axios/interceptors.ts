import { tokenStorage } from "@/lib/storage/token-storage";
import { AxiosError } from "axios";
import { axiosInstance } from "./axios";
import { ApiError } from "./errors";
import { refreshSession } from "./refresh";
import type { CustomAxiosRequestConfig } from "./types";

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const config = error.config as CustomAxiosRequestConfig | undefined;

    const response =
      typeof error.response?.data === "object" && error.response.data !== null
        ? (error.response.data as { error?: string; message?: string })
        : {};
    const shouldRefresh =
      error.response?.status === 401 &&
      (response.error === "TOKEN_EXPIRED" ||
        response.error === "TOKEN_NOT_PROVIDED") &&
      config &&
      !config._retry &&
      !config.skipAuthRefresh &&
      !config.url?.includes("/auth/refresh-token");
    if (shouldRefresh) {
      config._retry = true;

      try {
        await refreshSession();

        return axiosInstance(config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    const apiError = new ApiError({
      message:
        (error.response?.data as any)?.message ??
        error.message ??
        "Something went wrong",

      statusCode: error.response?.status ?? 500,
    });

    return Promise.reject(apiError);
  },
);
