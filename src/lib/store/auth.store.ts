import { authApi } from "@/services/auth.service";
import { create } from "zustand";
import { IAuthUser } from "../interfaces/auth/auth-response.interface";

interface AuthState {
  user: IAuthUser | null;

  isLoading: boolean;

  setUser: (user: IAuthUser | null) => void;

  setLoading: (loading: boolean) => void;

  clearUser: () => void;

  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  isLoading: true,

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  setUser: (user) =>
    set({
      user,
      isLoading: false,
    }),

  clearUser: () =>
    set({
      user: null,
      isLoading: false,
    }),

  refreshUser: async () => {
    try {
      const user = await authApi.me();

      set({
        user: user.data,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        isLoading: false,
      });
    }
  },
}));
