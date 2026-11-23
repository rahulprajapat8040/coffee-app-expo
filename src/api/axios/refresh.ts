import { axiosInstance } from "./axios";
import type { IApiResponse } from "./base-res.interface";
import type { IAuthResponse } from "@/lib/interfaces/auth/auth-response.interface";
import { tokenStorage } from "@/lib/storage/token-storage";
import type { CustomAxiosRequestConfig } from "./types";

let isRefreshing = false;

type QueueItem = {
  resolve: () => void;
  reject: (error: unknown) => void;
};

let failedQueue: QueueItem[] = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

export async function refreshSession(): Promise<void> {
  if (isRefreshing) {
    return new Promise<void>((resolve, reject) => {
      failedQueue.push({
        resolve,
        reject,
      });
    });
  }

  isRefreshing = true;
  let refreshError: unknown;

  try {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error("Refresh token is unavailable");
    }

    const response = await axiosInstance.post<IApiResponse<IAuthResponse>>(
      "/auth/refresh-token",
      undefined,
      {
        headers: { "X-Refresh-Token": refreshToken },
        skipAuthRefresh: true,
      } as CustomAxiosRequestConfig,
    );
    await tokenStorage.setTokens(
      response.data.data.accessToken,
      response.data.data.refreshToken,
    );

  } catch (error) {
    refreshError = error;

    await tokenStorage.clearTokens();

    throw error;
  } finally {
    isRefreshing = false;
    processQueue(refreshError);
  }
}