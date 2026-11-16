import { logger } from "@/lib/helper/logger.helper";
import { tokenStorage } from "@/lib/storage/token-storage";
import { AxiosError } from "axios";
import { axiosInstance } from "./axios";
import { ApiError } from "./errors";
import { refreshSession } from "./refresh";

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getAccessToken();
    logger.log("token isss", token);
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
    const config = error.config as any;

    const response = error.response?.data as {
      error?: string;
      message?: string;
    };
    const shouldRefresh =
      error.response?.status === 401 &&
      (response.error === "TOKEN_EXPIRED" ||
        response.error === "TOKEN_NOT_PROVIDED") &&
      config &&
      !config._retry &&
      !config.skipAuthRefresh;
    console.log("interseee", response.error);
    if (shouldRefresh) {
      config._retry = true;

      try {
        console.log("session refresh");
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
